package cli

import (
	"github.com/rs/zerolog/log"

	"github.com/yeldiRium/leetbot/cli/commands"
)

func RunCLI() {
	err := commands.RootCommand.Execute()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to execute command")
	}
}
