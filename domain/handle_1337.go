package domain

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/responses"
	"github.com/yeldiRium/leetbot/store/active_chats"
	"github.com/yeldiRium/leetbot/store/current_leet"
	"github.com/yeldiRium/leetbot/telegram"
	"github.com/yeldiRium/leetbot/utils"
)

func Handle1337(
	message *tgbotapi.Message,
	leetConfiguration LeetConfiguration,
	activeChatsStore *active_chats.ActiveChatsStore,
	currentLeetStore *current_leet.CurrentLeetStore,
) (*tgbotapi.MessageConfig, error) {
	chatConfiguration, ok, err := activeChatsStore.GetChatConfiguration(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		msg := telegram.NewErrorMessage(errors.FailedToReadFromActiveChatsStore, message.Chat.ID, message.MessageID)
		return &msg, nil
	}

	if !ok || !chatConfiguration.IsActive {
		return nil, nil
	}

	if !leetConfiguration.IsItCurrentlyLeet(chatConfiguration.TimeZone) {
		messageText := responses.GetInsult()
		msg := telegram.NewMessageWithReply(messageText, message.Chat.ID, message.MessageID)
		return &msg, nil
	}

	currentLeet, _, err := currentLeetStore.GetCurrentLeet(message.Chat.ID)
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from current leet store")
		msg := telegram.NewErrorMessage(errors.FailedToReadFromCurrentLeetStore, message.Chat.ID, message.MessageID)
		return &msg, nil
	}
	if currentLeet.IsAborted {
		return nil, nil
	}

	userName := telegram.GetLegibleUserName(message.From)

	if utils.SliceContainsString(currentLeet.Participants, userName) {
		if err := currentLeetStore.AbortLeet(message.Chat.ID, userName); err != nil {
			log.Warn().Err(err).Msg("failed to write to current leet store")
			msg := telegram.NewErrorMessage(errors.FailedToWriteToCurrentLeetStore, message.Chat.ID, message.MessageID)
			return &msg, nil
		}
		messageText := responses.GetMajorInsult(userName)
		msg := telegram.NewMessageWithReply(messageText, message.Chat.ID, message.MessageID)
		return &msg, nil
	}

	if err := currentLeetStore.AddParticipantToLeet(message.Chat.ID, userName); err != nil {
		log.Warn().Err(err).Msg("failed to write to current leet store")
		msg := telegram.NewErrorMessage(errors.FailedToWriteToCurrentLeetStore, message.Chat.ID, message.MessageID)
		return &msg, nil
	}

	return nil, nil
}
