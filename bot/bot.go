package bot

import (
	"context"
	"fmt"
	"github.com/yeldiRium/leetbot/domain"
	"github.com/yeldiRium/leetbot/responses"
	"github.com/yeldiRium/leetbot/scheduling"
	"github.com/yeldiRium/leetbot/store/activechats"
	"github.com/yeldiRium/leetbot/store/currentleet"
	"github.com/yeldiRium/leetbot/telegram"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

const (
	leetHour   = 13
	leetMinute = 37
)

var (
	leetConfiguration = domain.LeetConfiguration{
		LeetHour:   leetHour,
		LeetMinute: leetMinute,
	}
)

type Bot struct {
	UserName    string
	BotAPI      *tgbotapi.BotAPI
	ActiveChats *activechats.ActiveChatsStore
	CurrentLeet *currentleet.CurrentLeetStore
}

func (bot *Bot) Run(ctx context.Context) {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.BotAPI.GetUpdatesChan(u)

	go func() {
		announcementSchedule := scheduling.NewTicker(leetMinute - 1)
		for range announcementSchedule.C {
			log.Debug().Msg("sending out announcements")
			activeChats, err := bot.ActiveChats.GetActiveChats()
			if err != nil {
				log.Warn().Err(err).Msg("failed to read from active chats store")
			}

			for chatID, chatConfiguration := range activeChats {
				now := time.Now()
				nowThere := now.In(chatConfiguration.TimeZone)
				if nowThere.Hour() == leetHour {
					log.Debug().Msgf("sending announcement to %v, in their timezone it is currently %v", chatID, nowThere)
					go bot.AnnounceLeet(chatID)
				}
			}
		}
	}()

	go func() {
		reportSchedule := scheduling.NewTicker(leetMinute + 1)
		for range reportSchedule.C {
			log.Debug().Msg("sending out reports")
			activeChats, err := bot.ActiveChats.GetActiveChats()
			if err != nil {
				log.Warn().Err(err).Msg("failed to read from active chats store")
			}

			for chatID, chatConfiguration := range activeChats {
				now := time.Now()
				nowThere := now.In(chatConfiguration.TimeZone)
				if nowThere.Hour() == leetHour {
					log.Debug().Msgf("sending report to %v, in their timezone it is currently %v", chatID, nowThere)
					go bot.ReportLeet(chatID)
				}
			}
		}
	}()

	for {
		select {
		case <-ctx.Done():
			return
		case update := <-updates:
			go bot.HandleUpdate(update)
		}
	}
}

func (bot *Bot) HandleUpdate(update tgbotapi.Update) error {
	if UpdateIs1337(update) {
		response, err := domain.Handle1337(update.Message, leetConfiguration, bot.ActiveChats, bot.CurrentLeet)
		if err != nil {
			log.Warn().Err(err).Msg("failed to handle potential violation")
		}
		if response != nil {
			if _, err := bot.sendMessage(response); err != nil {
				return err
			}
		}
	}

	if update.Message != nil {
		response, wasAViolation, err := domain.HandlePotentialViolation(update.Message, leetConfiguration, bot.ActiveChats, bot.CurrentLeet)
		if err != nil {
			log.Warn().Err(err).Msg("failed to handle potential violation")
		}
		if response != nil {
			if _, err := bot.sendMessage(response); err != nil {
				return err
			}
		}
		if wasAViolation {
			return nil
		}
	}

	command, hasCommand := telegram.ParseUpdateToCommand(update)
	if hasCommand {
		if command.Recipient != "" && command.Recipient != bot.UserName {
			return nil
		}
		log.Info().
			Str("command", command.Name).
			Strs("parameters", command.Parameters).
			Str("recipient", command.Recipient).
			Msg("received a command")

		message, err := domain.ExecuteCommand(command, bot.ActiveChats)
		if err != nil {
			log.Warn().Err(err).Msg("failed to execute command")
			return fmt.Errorf("failed to execute command: %w", err)
		}

		if message != nil {
			if _, err := bot.sendMessage(message); err != nil {
				log.Warn().Err(err).Msg("failed to respond to command")
				return fmt.Errorf("failed to respond to command: %w", err)
			}
		}
	}
	return nil
}

func (bot *Bot) sendMessage(message *tgbotapi.MessageConfig) (int, error) {
	result, err := bot.BotAPI.Send(message)
	if err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
		return 0, err
	}

	return result.MessageID, nil
}

func (bot *Bot) SendMessage(messageText string, chatID int64) (int, error) {
	msg := tgbotapi.NewMessage(chatID, messageText)
	return bot.sendMessage(&msg)
}

func (bot *Bot) AnnounceLeet(chatID int64) {
	announcementID, _ := bot.SendMessage(responses.GetAnnouncement(), chatID)
	pinConfig := tgbotapi.PinChatMessageConfig{
		ChatID:              chatID,
		MessageID:           announcementID,
		DisableNotification: false,
	}
	go bot.BotAPI.Send(pinConfig)

	time.Sleep(57 * time.Second)
	go bot.SendMessage("T-3", chatID)

	time.Sleep(1 * time.Second)
	go bot.SendMessage("T-2", chatID)

	time.Sleep(1 * time.Second)
	go bot.SendMessage("T-1", chatID)

	time.Sleep(1 * time.Second)
	go bot.SendMessage("1337", chatID)

	unpinConfig := tgbotapi.UnpinChatMessageConfig{
		ChatID:    chatID,
		MessageID: announcementID,
	}
	go bot.BotAPI.Send(unpinConfig)
}

func (bot *Bot) ReportLeet(chatID int64) {
	currentLeet, _, err := bot.CurrentLeet.GetCurrentLeet(chatID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from current leet store")
		return
	}

	if !currentLeet.IsAborted {
		messageText := responses.GetCongratulations(currentLeet.Participants, false, 0)
		bot.SendMessage(messageText, chatID)
	}

	if err := bot.CurrentLeet.ResetChat(chatID); err != nil {
		log.Warn().Err(err).Msg("failed to write to current leet store")
		return
	}
}
