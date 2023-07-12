package domain

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"

	"github.com/yeldiRium/leetbot/store/active_chats"
	"github.com/yeldiRium/leetbot/telegram"
)

func ExecuteCommand(command telegram.Command, activeChats *active_chats.ActiveChatsStore) (response *tgbotapi.MessageConfig, err error) {
	switch command.Name {
	case "info":
		return HandleInfoCommand(command, activeChats)
	case "enable":
		return HandleEnableCommand(command, activeChats)
	case "disable":
		return HandleDisableCommand(command, activeChats)
	case "set-timezone":
		return HandleSetTimezoneCommand(command, activeChats)
	}

	return nil, nil
}
