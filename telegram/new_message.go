package telegram

import (
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/yeldiRium/leetbot/errors"
)

func NewMessage(messageText string, chatID int64) tgbotapi.MessageConfig {
	return tgbotapi.NewMessage(chatID, messageText)
}

func NewMessageWithReply(messageText string, chatID int64, messageID int) tgbotapi.MessageConfig {
	message := NewMessage(messageText, chatID)
	message.ReplyToMessageID = messageID
	return message
}

func NewErrorMessage(errorCode errors.ErrorCode, chatID int64, messageID int) tgbotapi.MessageConfig {
	messageText := fmt.Sprintf("something went wrong. please contact my administrator. or don't, I don't care. if you do, include this code: %d", errorCode)
	return NewMessageWithReply(messageText, chatID, messageID)
}
