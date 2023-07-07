package active_chats

import "os"

func writeDataFile(dataFilePath string, dataFile File) error {
	return os.WriteFile(dataFilePath, dataFile, 0644)
}
