package domain

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/responses"
	"github.com/yeldiRium/leetbot/store/activechats"
	"github.com/yeldiRium/leetbot/store/currentleet"
	"github.com/yeldiRium/leetbot/telegram"
)

func HandlePotentialViolation(
	message *tgbotapi.Message,
	leetConfiguration LeetConfiguration,
	activeChatsStore *activechats.ActiveChatsStore,
	currentLeetStore *currentleet.CurrentLeetStore,
) (response *tgbotapi.MessageConfig, wasViolation bool, err error) {
	chatConfiguration, ok, err := activeChatsStore.GetChatConfiguration(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		msg := telegram.NewErrorMessage(errors.FailedToReadFromActiveChatsStore, message.Chat.ID, message.MessageID)
		return &msg, false, nil
	}

	if !ok || !chatConfiguration.IsActive {
		return nil, false, nil
	}

	if !leetConfiguration.IsItCurrentlyLeet(chatConfiguration.TimeZone) || message.Text == "1337" {
		return nil, false, nil
	}

	userName := telegram.GetLegibleUserName(message.From)
	if err := currentLeetStore.AbortLeet(message.Chat.ID, userName); err != nil {
		log.Warn().Err(err).Msg("failed to write to current leet store")
		msg := telegram.NewErrorMessage(errors.FailedToWriteToCurrentLeetStore, message.Chat.ID, message.MessageID)
		return &msg, false, nil
	}
	messageText := responses.GetMajorInsult(userName)
	msg := telegram.NewMessageWithReply(messageText, message.Chat.ID, message.MessageID)
	return &msg, true, nil
}
