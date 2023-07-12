package bot

import (
	"context"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/store/activechats"
	"github.com/yeldiRium/leetbot/store/currentleet"
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

	activeChatsStore := activechats.NewActiveChats(path.Join(options.StoreDirectory, "activeChats.store"))
	currentLeetsStore := currentleet.NewCurrentLeetStore(path.Join(options.StoreDirectory, "currentLeets.store"))

	bot := Bot{
		UserName:    options.UserName,
		BotAPI:      botAPI,
		ActiveChats: activeChatsStore,
		CurrentLeet: currentLeetsStore,
	}

	go bot.Run(ctx)
}
