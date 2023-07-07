package bot

import (
	"context"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/rs/zerolog/log"
	"github.com/yeldiRium/leetbot/store/active_chats"
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

	bot := Bot{
		BotAPI:      botAPI,
		ActiveChats: activeChatsStore,
	}

	go bot.Run(ctx)
}
