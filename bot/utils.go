package bot

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"

	"github.com/yeldiRium/leetbot/telegram"
)

func UpdateIs1337(update tgbotapi.Update) bool {
	if !telegram.UpdateIsTextMessage(update) {
		return false
	}
	if !telegram.UpdateIsMessageFromUser(update) {
		return false
	}
	return update.Message.Text == "1337"
}
