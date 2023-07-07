package active_chats

import (
	"encoding/json"
)

type File []byte

func NewDataFile() File {
	return []byte("[]")
}

func (dataFile *File) Parse() (map[int64]bool, error) {
	var chatIDs []int64
	if err := json.Unmarshal(*dataFile, &chatIDs); err != nil {
		return nil, err
	}

	activeChats := make(map[int64]bool)
	for _, chatID := range chatIDs {
		activeChats[chatID] = true
	}
	return activeChats, nil
}

func (dataFile *File) Set(activeChats map[int64]bool) error {
	chatIDs := make([]int64, 0)
	for chatID, isActive := range activeChats {
		if isActive {
			chatIDs = append(chatIDs, chatID)
		}
	}

	bytes, err := json.Marshal(chatIDs)
	if err != nil {
		return err
	}
	*dataFile = bytes
	return nil
}
