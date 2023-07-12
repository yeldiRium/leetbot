package domain

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/store/active_chats"
	"github.com/yeldiRium/leetbot/telegram"
)

func HandleDisableCommand(command telegram.Command, activeChatsStore *active_chats.ActiveChatsStore) (*tgbotapi.MessageConfig, error) {
	if err := activeChatsStore.DeactivateChat(command.ChatID()); err != nil {
		log.Warn().Err(err).Msg("failed to remove chat from active chats store")
		message := telegram.NewErrorMessage(errors.FailedToRemoveChatFromActiveChats, command.ChatID(), command.MessageID())
		return &message, nil
	}

	messageText := "Leeten ist vorbei. Tschüssi!"
	message := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
	return &message, nil
}
