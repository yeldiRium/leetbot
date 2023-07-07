package bot

import "fmt"

type Configuration struct {
	Verbose        bool
	APIToken       string
	UserName       string
	StoreDirectory string
}

func (configuration Configuration) Apply() (RunOptions, error) {
	if configuration.APIToken == "" {
		return RunOptions{}, fmt.Errorf("parameter api-token must be set")
	}
	if configuration.UserName == "" {
		return RunOptions{}, fmt.Errorf("parameter user-name must be set")
	}
	if configuration.StoreDirectory == "" {
		return RunOptions{}, fmt.Errorf("parameter store-directory must not be set")
	}

	return RunOptions{
		Verbose:        configuration.Verbose,
		APIToken:       configuration.APIToken,
		UserName:       configuration.UserName,
		StoreDirectory: configuration.StoreDirectory,
	}, nil
}
