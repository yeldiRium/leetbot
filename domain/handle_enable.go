package domain

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/store/active_chats"
	"github.com/yeldiRium/leetbot/telegram"
)

func HandleEnableCommand(command telegram.Command, activeChatsStore *active_chats.ActiveChatsStore) (*tgbotapi.MessageConfig, error) {
	if err := activeChatsStore.ActivateChat(command.ChatID()); err != nil {
		log.Warn().Err(err).Msg("failed to add chat to active chats store")
		message := telegram.NewErrorMessage(errors.FailedToAddChatToActiveChats, command.ChatID(), command.MessageID())
		return &message, nil
	}

	messageText := "Hallo zusammen! Ich überwache diesen Channel nun. Frohes leeten!"
	message := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
	return &message, nil
}
