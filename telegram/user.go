package telegram

import (
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func GetLegibleUserName(user *tgbotapi.User) string {
	if user.UserName != "" {
		return user.UserName
	}
	if user.FirstName != "" {
		return user.FirstName
	}
	return strconv.Itoa(int(user.ID))
}
