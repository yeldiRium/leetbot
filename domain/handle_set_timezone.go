package domain

import (
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/errors"
	"github.com/yeldiRium/leetbot/store/activechats"
	"github.com/yeldiRium/leetbot/telegram"
	"time"
)

func HandleSetTimezoneCommand(command telegram.Command, activeChatsStore *activechats.ActiveChatsStore) (*tgbotapi.MessageConfig, error) {
	parameters := command.Parameters

	if len(parameters) != 1 {
		messageText := "Um die Zeitzone zu setzen, musst du exakt einen Parameter angeben. Versuch's mal mit\n/set-timezone Europe/Berlin"
		response := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
		return &response, nil
	}

	chatIsActive, err := activeChatsStore.IsChatActive(command.ChatID())
	if err != nil {
		log.Warn().Err(err).Msg("failed to read from active chats store")
		response := telegram.NewErrorMessage(errors.FailedToReadFromActiveChatsStore, command.ChatID(), command.MessageID())
		return &response, nil
	}
	if !chatIsActive {
		messageText := "Die Zeitzone kann nur in Chats gesetzt werden, die aktiv sind. Benutze zuerst /enable"
		response := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
		return &response, nil
	}

	timeZone, err := time.LoadLocation(parameters[0])
	if err != nil {
		messageText := "Die Zeitzone habe ich leider nicht erkannt."
		response := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
		return &response, nil
	}

	if err := activeChatsStore.SetChatTimezone(command.ChatID(), timeZone); err != nil {
		log.Warn().Err(err).Msg("failed to set timezone in active chats store")
		response := telegram.NewErrorMessage(errors.FailedToSetTimezoneInActiveChats, command.ChatID(), command.MessageID())
		return &response, nil
	}

	messageText := fmt.Sprintf("Zeitzone wurde auf %s gesetzt.", timeZone.String())
	response := telegram.NewMessageWithReply(messageText, command.ChatID(), command.MessageID())
	return &response, nil
}
