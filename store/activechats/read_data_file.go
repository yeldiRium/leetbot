package activechats

import (
	"os"
	"strings"
)

func readDataFile(dataFilePath string) (File, error) {
	data, err := os.ReadFile(dataFilePath)
	if err != nil {
		if strings.HasSuffix(err.Error(), "no such file or directory") {
			return NewDataFile(), nil
		}
		return nil, err
	}

	return File(data), nil
}
