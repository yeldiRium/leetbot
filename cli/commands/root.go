package commands

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/rs/zerolog/log"
	"github.com/spf13/cobra"

	"github.com/yeldiRium/leetbot/bot"
)

var rootVerboseFlag bool
var rootAPITokenFlag string
var rootUserNameFlag string
var rootStoreDirectoryFlag string

func init() {
	RootCommand.PersistentFlags().BoolVarP(&rootVerboseFlag, "verbose", "", false, "enables verbose mode")
	RootCommand.PersistentFlags().StringVarP(&rootAPITokenFlag, "api-token", "", "", "the bot's telegram API token")
	RootCommand.PersistentFlags().StringVarP(&rootUserNameFlag, "user-name", "", "", "the bot's telegram user name")
	RootCommand.PersistentFlags().StringVarP(&rootStoreDirectoryFlag, "store-directory", "", "", "the directory in which data will be persisted")
}

var RootCommand = &cobra.Command{
	Use:   "eventsourcingdb-server",
	Short: "EventSourcingDB is an event store",
	Long:  "EventSourcingDB is an event store.",
	RunE: func(command *cobra.Command, args []string) error {
		configuration := bot.Configuration{
			Verbose:        rootVerboseFlag,
			APIToken:       rootAPITokenFlag,
			UserName:       rootUserNameFlag,
			StoreDirectory: rootStoreDirectoryFlag,
		}
		options, err := configuration.Apply()
		if err != nil {
			log.Fatal().Err(err).Msg("failed to apply configuration")
			return err
		}

		controlCContext, _ := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT)
		shutdownContext, shutdown := context.WithCancel(context.Background())

		go bot.Run(shutdownContext, options)

		<-controlCContext.Done()
		log.Info().Msg("shutting down gracefully...")
		log.Info().Msg("press <ctrl>+<c> to immediately shutdown")

		shutdown()

		go func() {
			controlCContext, _ = signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT)
			<-controlCContext.Done()
			log.Warn().Msg("shut down non-gracefully")
			os.Exit(1)
		}()

		log.Info().Msg("shut down gracefully")
		os.Exit(0)
		return nil
	},
}
