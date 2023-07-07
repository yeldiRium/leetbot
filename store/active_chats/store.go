package active_chats

import (
	"fmt"
	"sync"
	"time"
)

type ActiveChatsStore struct {
	storeFilePath string
	lock          sync.RWMutex
}

type ActiveChats map[int64]ChatConfiguration

func NewActiveChats(storeFilePath string) *ActiveChatsStore {
	return &ActiveChatsStore{
		storeFilePath: storeFilePath,
		lock:          sync.RWMutex{},
	}
}

func (store *ActiveChatsStore) readActiveChats() (ActiveChats, error) {
	dataFile, err := readDataFile(store.storeFilePath)
	if err != nil {
		return nil, err
	}

	activeChats, err := dataFile.Parse()
	if err != nil {
		return nil, err
	}

	return activeChats, nil
}

func (store *ActiveChatsStore) writeActiveChats(activeChats ActiveChats) error {
	var dataFile File
	if err := dataFile.Set(activeChats); err != nil {
		return err
	}

	return writeDataFile(store.storeFilePath, dataFile)
}

func (store *ActiveChatsStore) ActivateChat(chatID int64) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return err
	}

	chatConfiguration, ok := activeChats[chatID]

	if !ok {
		location, _ := time.LoadLocation("UTC")
		chatConfiguration = ChatConfiguration{
			IsActive: false,
			TimeZone: location,
		}
	}

	chatConfiguration.IsActive = true

	activeChats[chatID] = chatConfiguration

	if err := store.writeActiveChats(activeChats); err != nil {
		return err
	}
	return nil
}

func (store *ActiveChatsStore) DeactivateChat(chatID int64) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return err
	}

	chatConfiguration, ok := activeChats[chatID]

	if ok {
		chatConfiguration.IsActive = false

		activeChats[chatID] = chatConfiguration

		if err := store.writeActiveChats(activeChats); err != nil {
			return err
		}
	}
	return nil
}

func (store *ActiveChatsStore) SetChatTimezone(chatID int64, location *time.Location) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return err
	}

	chatConfiguration, ok := activeChats[chatID]

	if !ok || !chatConfiguration.IsActive {
		return fmt.Errorf("can not set timezone for deactivated chat")
	}

	chatConfiguration.TimeZone = location

	activeChats[chatID] = chatConfiguration

	if err := store.writeActiveChats(activeChats); err != nil {
		return err
	}
	return nil
}

func (store *ActiveChatsStore) IsChatActive(chatID int64) (bool, error) {
	store.lock.RLock()
	defer store.lock.RUnlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return false, err
	}

	return activeChats[chatID].IsActive, nil
}

func (store *ActiveChatsStore) GetChatConfiguration(chatID int64) (chatConfiguration ChatConfiguration, ok bool, err error) {
	store.lock.RLock()
	defer store.lock.RUnlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return ChatConfiguration{}, false, err
	}

	chatConfiguration, ok = activeChats[chatID]
	return
}

func (store *ActiveChatsStore) GetActiveChats() (ActiveChats, error) {
	store.lock.RLock()
	defer store.lock.RUnlock()

	storedChats, err := store.readActiveChats()
	if err != nil {
		return ActiveChats{}, err
	}

	activeChats := make(map[int64]ChatConfiguration)
	for chatID, chatConfiguration := range storedChats {
		if chatConfiguration.IsActive {
			activeChats[chatID] = chatConfiguration
		}
	}

	return activeChats, nil
}
