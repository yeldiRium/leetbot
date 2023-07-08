package bot

import (
	"context"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/store/active_chats"
	"github.com/yeldiRium/leetbot/store/current_leet"
	"path"
)

type RunOptions struct {
	Verbose        bool
	APIToken       string
	UserName       string
	StoreDirectory string
}

func Run(ctx context.Context, options RunOptions) {
	botAPI, err := tgbotapi.NewBotAPI(options.APIToken)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to telegram API")
	}

	activeChatsStore := active_chats.NewActiveChats(path.Join(options.StoreDirectory, "activeChats.store"))
	currentLeetsStore := current_leet.NewCurrentLeetStore(path.Join(options.StoreDirectory, "currentLeets.store"))

	bot := Bot{
		UserName:    options.UserName,
		BotAPI:      botAPI,
		ActiveChats: activeChatsStore,
		CurrentLeet: currentLeetsStore,
	}

	go bot.Run(ctx)
}
