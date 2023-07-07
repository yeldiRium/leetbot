package bot

import (
	"context"
	"fmt"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/store/active_chats"

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
		}
	}
}

func (bot *Bot) SendErrorMessage(message *tgbotapi.Message, chat *tgbotapi.Chat, errorCode errors.ErrorCode) {
	messageText := fmt.Sprintf("something went wrong. please contact my administrator. or don't, I don't care. if you do, include this code: %d", errorCode)
	msg := tgbotapi.NewMessage(chat.ID, messageText)
	msg.ReplyToMessageID = message.MessageID
	if _, err := bot.BotAPI.Send(msg); err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
	}
}

func (bot *Bot) InfoCommand(message *tgbotapi.Message) {
	messageText := ""

	chatIsActive, err := bot.ActiveChats.IsChatActive(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToReadFromActiveChatsStore)
		return
	}

	if chatIsActive {
		messageText += "Ich bin in diesem Chat aktiv. Gib /disable ein, um mich zu deaktivieren."
	} else {
		messageText += "Ich bin in diesem Chat nicht aktiv. Gib /enable ein, um mich zu aktivieren."
	}

	msg := tgbotapi.NewMessage(message.Chat.ID, messageText)
	msg.ReplyToMessageID = message.MessageID
	if _, err := bot.BotAPI.Send(msg); err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
	}
}

func (bot *Bot) EnableCommand(message *tgbotapi.Message) {
	if err := bot.ActiveChats.AddChat(message.Chat.ID); err != nil {
		log.Warn().Err(err).Msg("failed to add chat to active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToAddChatToActiveChats)
		return
	}

	messageText := "Hallo zusammen! Ich überwache diesen Channel nun. Frohes leeten!"
	msg := tgbotapi.NewMessage(message.Chat.ID, messageText)
	msg.ReplyToMessageID = message.MessageID
	if _, err := bot.BotAPI.Send(msg); err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
	}
}

func (bot *Bot) DisableCommand(message *tgbotapi.Message) {
	if err := bot.ActiveChats.RemoveChat(message.Chat.ID); err != nil {
		log.Warn().Err(err).Msg("failed to remove chat from active chats store")
		bot.SendErrorMessage(message, message.Chat, errors.FailedToRemoveChatFromActiveChats)
		return
	}

	messageText := "Leeten ist vorbei. Tschüssi!"
	msg := tgbotapi.NewMessage(message.Chat.ID, messageText)
	msg.ReplyToMessageID = message.MessageID
	if _, err := bot.BotAPI.Send(msg); err != nil {
		log.Warn().Err(err).Msg("could not send message to chat")
	}
}

func (bot *Bot) Handle1337(fromUser *tgbotapi.User) {

}
