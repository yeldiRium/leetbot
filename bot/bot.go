package bot

import (
	"context"
	"fmt"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/responses"
	"github.com/yeldiRium/leetbot/scheduling"
	"github.com/yeldiRium/leetbot/store/active_chats"
	"github.com/yeldiRium/leetbot/store/current_leet"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

type Bot struct {
	BotAPI      *tgbotapi.BotAPI
	ActiveChats *active_chats.ActiveChatsStore
	CurrentLeet *current_leet.CurrentLeetStore
}

func (bot *Bot) Run(ctx context.Context) {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.BotAPI.GetUpdatesChan(u)

	go func() {
		announcementSchedule := scheduling.NewTicker(36)
		for range announcementSchedule.C {
			activeChats, err := bot.ActiveChats.GetActiveChats()
			if err != nil {
				log.Warn().Err(err).Msg("failed to read from active chats store")
			}

			for chatID, chatConfiguration := range activeChats {
				now := time.Now()
				now.In(chatConfiguration.TimeZone)
				if now.Hour() == 13 {
					go bot.AnnounceLeet(chatID)
				}
			}
		}
	}()

	go func() {
		announcementSchedule := scheduling.NewTicker(38)
		for range announcementSchedule.C {
			activeChats, err := bot.ActiveChats.GetActiveChats()
			if err != nil {
				log.Warn().Err(err).Msg("failed to read from active chats store")
			}

			for chatID, chatConfiguration := range activeChats {
				now := time.Now()
				now.In(chatConfiguration.TimeZone)
				if now.Hour() == 13 {
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

func (bot *Bot) HandleUpdate(update tgbotapi.Update) {
	if UpdateIs1337(update) {
		bot.Handle1337(update.Message)
	}
	if update.Message != nil {
		wasAViolation := bot.HandlePotentialViolation(update.Message)
		if wasAViolation {
			return
		}
	}

	command, parameters, hasCommand := UpdateHasCommand(update)
	if hasCommand {
		log.Info().Str("command", command).Strs("parameters", parameters).Msg("received a command")
		switch command {
		case "info":
			bot.InfoCommand(update.Message)
		case "enable":
			bot.EnableCommand(update.Message)
		case "disable":
			bot.DisableCommand(update.Message)
		case "set-timezone":
			bot.SetTimezone(update.Message, parameters)
		}
	}
}

func (bot *Bot) SendMessage(messageText string, chatID int64) int {
	msg := tgbotapi.NewMessage(chatID, messageText)
	result, err := bot.BotAPI.Send(msg)
	if err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
	}

	return result.MessageID
}

func (bot *Bot) SendMessageWithReply(messageText string, chatID int64, messageID int) {
	msg := tgbotapi.NewMessage(chatID, messageText)
	msg.ReplyToMessageID = messageID
	if _, err := bot.BotAPI.Send(msg); err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
	}
}

func (bot *Bot) SendErrorMessage(message *tgbotapi.Message, chat *tgbotapi.Chat, errorCode errors.ErrorCode) {
	messageText := fmt.Sprintf("something went wrong. please contact my administrator. or don't, I don't care. if you do, include this code: %d", errorCode)
	bot.SendMessageWithReply(messageText, chat.ID, message.MessageID)
}

func (bot *Bot) InfoCommand(message *tgbotapi.Message) {
	messageText := ""

	chatConfiguration, ok, err := bot.ActiveChats.GetChatConfiguration(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToReadFromActiveChatsStore)
		return
	}

	if !ok || !chatConfiguration.IsActive {
		messageText += "Ich bin in diesem Chat nicht aktiv. Gib /enable ein, um mich zu aktivieren."
	} else {
		messageText += "Ich bin in diesem Chat aktiv. Gib /disable ein, um mich zu deaktivieren.\n"
		messageText += fmt.Sprintf("Die eingestellte Zeitzone ist %s.", chatConfiguration.TimeZone.String())
	}

	bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
}

func (bot *Bot) EnableCommand(message *tgbotapi.Message) {
	if err := bot.ActiveChats.ActivateChat(message.Chat.ID); err != nil {
		log.Warn().Err(err).Msg("failed to add chat to active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToAddChatToActiveChats)
		return
	}

	messageText := "Hallo zusammen! Ich überwache diesen Channel nun. Frohes leeten!"
	bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
}

func (bot *Bot) DisableCommand(message *tgbotapi.Message) {
	if err := bot.ActiveChats.DeactivateChat(message.Chat.ID); err != nil {
		log.Warn().Err(err).Msg("failed to remove chat from active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToRemoveChatFromActiveChats)
		return
	}

	messageText := "Leeten ist vorbei. Tschüssi!"
	bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
}

func (bot *Bot) SetTimezone(message *tgbotapi.Message, parameters []string) {
	if len(parameters) != 1 {
		messageText := "Um die Zeitzone zu setzen, musst du exakt einen Parameter angeben. Versuch's mal mit\n/set-timezone Europe/Berlin"
		bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
		return
	}

	chatIsActive, err := bot.ActiveChats.IsChatActive(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToReadFromActiveChatsStore)
		return
	}
	if !chatIsActive {
		messageText := "Die Zeitzone kann nur in Chats gesetzt werden, die aktiv sind. Benutze zuerst /enable"
		bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
		return
	}

	timeZone, err := time.LoadLocation(parameters[0])
	if err != nil {
		messageText := "Die Zeitzone habe ich leider nicht erkannt."
		bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
		return
	}

	if err := bot.ActiveChats.SetChatTimezone(message.Chat.ID, timeZone); err != nil {
		log.Warn().Err(err).Msg("failed to set timezone in active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToSetTimezoneInActiveChats)
		return
	}

	messageText := fmt.Sprintf("Zeitzone wurde auf %s gesetzt.", timeZone.String())
	bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
}

func (bot *Bot) HandlePotentialViolation(message *tgbotapi.Message) bool {
	chatConfiguration, ok, err := bot.ActiveChats.GetChatConfiguration(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		return false
	}

	if !ok || !chatConfiguration.IsActive {
		return false
	}

	if !IsItCurrentlyLeet(chatConfiguration.TimeZone) || message.Text == "1337" {
		return false
	}

	messageText := responses.GetMajorInsult(GetLegibleUserName(message.From))
	bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
	return true
}

func (bot *Bot) Handle1337(message *tgbotapi.Message) {
	chatConfiguration, ok, err := bot.ActiveChats.GetChatConfiguration(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		return
	}

	if !ok || !chatConfiguration.IsActive {
		return
	}

	if IsItCurrentlyLeet(chatConfiguration.TimeZone) {
		currentLeet, _, err := bot.CurrentLeet.GetCurrentLeet(message.Chat.ID)
		if err != nil {
			log.Warn().Err(err).Msg("failed to read from current leet store")
			return
		}
		if currentLeet.IsAborted {
			return
		}

		userName := GetLegibleUserName(message.From)

		if SliceContainsString(currentLeet.Participants, userName) {
			if err := bot.CurrentLeet.AbortLeet(message.Chat.ID, userName); err != nil {
				log.Warn().Err(err).Msg("failed to write to current leet store")
			}
			messageText := responses.GetMajorInsult(userName)
			bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
			return
		}

		if err := bot.CurrentLeet.AddParticipantToLeet(message.Chat.ID, userName); err != nil {
			log.Warn().Err(err).Msg("failed to write to current leet store")
		}
	} else {
		messageText := responses.GetInsult()
		bot.SendMessageWithReply(messageText, message.Chat.ID, message.MessageID)
	}
}

func (bot *Bot) AnnounceLeet(chatID int64) {
	announcementId := bot.SendMessage(responses.GetAnnouncement(), chatID)
	pinConfig := tgbotapi.PinChatMessageConfig{
		ChatID:              chatID,
		MessageID:           announcementId,
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

	time.Sleep(1 * time.Minute)
	unpinConfig := tgbotapi.UnpinChatMessageConfig{
		ChatID:    chatID,
		MessageID: announcementId,
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
