package telegram

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"strings"
)

type Command struct {
	Name       string
	Recipient  string
	Parameters []string
	message    *tgbotapi.Message
}

func ParseUpdateToCommand(update tgbotapi.Update) (command Command, ok bool) {
	if !UpdateIsTextMessage(update) || !UpdateIsMessageFromUser(update) {
		return Command{}, false
	}
	if !strings.HasPrefix(update.Message.Text, "/") {
		return Command{}, false
	}

	command.message = update.Message

	parts := strings.Split(update.Message.Text, " ")
	rawCommand := parts[0][1:]
	commandParts := strings.Split(rawCommand, "@")
	command.Name = commandParts[0]
	if len(commandParts) > 1 {
		command.Recipient = commandParts[1]
	}

	if len(parts) > 1 {
		command.Parameters = parts[1:]
	} else {
		command.Parameters = []string{}
	}
	ok = true
	return
}

func (command *Command) From() *tgbotapi.User {
	return command.message.From
}

func (command *Command) ChatID() int64 {
	return command.message.Chat.ID
}

func (command *Command) MessageID() int {
	return command.message.MessageID
}
