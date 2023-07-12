package telegram

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func UpdateIsMessageFromUser(update tgbotapi.Update) bool {
	return update.Message != nil && update.Message.From != nil
}

func UpdateIsTextMessage(update tgbotapi.Update) bool {
	return update.Message != nil && update.Message.Text != ""
}
