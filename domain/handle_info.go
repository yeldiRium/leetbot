package domain

import (
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/store/activechats"
	"github.com/yeldiRium/leetbot/telegram"
)

func HandleInfoCommand(command telegram.Command, activeChatsStore *activechats.ActiveChatsStore) (*tgbotapi.MessageConfig, error) {
	messageText := ""

	chatConfiguration, ok, err := activeChatsStore.GetChatConfiguration(command.ChatID())
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		message := telegram.NewErrorMessage(errors.FailedToReadFromActiveChatsStore, command.ChatID(), command.MessageID())
		return &message, nil
	}

	if !ok || !chatConfiguration.IsActive {
		messageText += "Ich bin in diesem Chat nicht aktiv. Gib /enable ein, um mich zu aktivieren."
	} else {
		messageText += "Ich bin in diesem Chat aktiv. Gib /disable ein, um mich zu deaktivieren.\n"
		messageText += fmt.Sprintf("Die eingestellte Zeitzone ist %s.", chatConfiguration.TimeZone.String())
	}

	message := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
	return &message, nil
}
