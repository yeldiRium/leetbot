package bot

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"strings"
)

func updateIsMessageFromUser(update tgbotapi.Update) bool {
	return update.Message != nil && update.Message.From != nil
}

func updateIsTextMessage(update tgbotapi.Update) bool {
	return update.Message != nil && update.Message.Text != ""
}

func UpdateHasCommand(update tgbotapi.Update) (command string, parameters []string, hasCommand bool) {
	if !updateIsTextMessage(update) || !updateIsMessageFromUser(update) {
		return "", []string{}, false
	}
	if !strings.HasPrefix(update.Message.Text, "/") {
		return "", []string{}, false
	}

	parts := strings.Split(update.Message.Text, " ")
	command = parts[0][1:]
	if len(parts) > 1 {
		parameters = parts[1:]
	} else {
		parameters = []string{}
	}
	hasCommand = true
	return
}

func UpdateIs1337(update tgbotapi.Update) bool {
	if !updateIsTextMessage(update) {
		return false
	}
	if !updateIsMessageFromUser(update) {
		return false
	}
	return update.Message.Text == "1337"
}
