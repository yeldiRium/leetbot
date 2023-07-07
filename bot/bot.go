package bot

import (
	"context"
	"fmt"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/store/active_chats"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
)

type Bot struct {
	BotAPI      *tgbotapi.BotAPI
	ActiveChats *active_chats.ActiveChatsStore
}

func (bot *Bot) Run(ctx context.Context) {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.BotAPI.GetUpdatesChan(u)

	for {
		select {
		case <-ctx.Done():
			return
		case update := <-updates:
			bot.HandleUpdate(update)
		}
	}
}

func (bot *Bot) HandleUpdate(update tgbotapi.Update) {
	if UpdateIs1337(update) {
		bot.Handle1337(update.Message.From)
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

func (bot *Bot) Handle1337(fromUser *tgbotapi.User) {

}
