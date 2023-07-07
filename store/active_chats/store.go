package active_chats

import "sync"

type ActiveChatsStore struct {
	storeFilePath string
	lock          sync.RWMutex
}

func NewActiveChats(storeFilePath string) *ActiveChatsStore {
	return &ActiveChatsStore{
		storeFilePath: storeFilePath,
		lock:          sync.RWMutex{},
	}
}

func (store *ActiveChatsStore) readActiveChats() (map[int64]bool, error) {
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

func (store *ActiveChatsStore) writeActiveChats(activeChats map[int64]bool) error {
	var dataFile File
	if err := dataFile.Set(activeChats); err != nil {
		return err
	}

	return writeDataFile(store.storeFilePath, dataFile)
}

func (store *ActiveChatsStore) AddChat(chatID int64) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return err
	}

	activeChats[chatID] = true

	if err := store.writeActiveChats(activeChats); err != nil {
		return err
	}
	return nil
}

func (store *ActiveChatsStore) RemoveChat(chatID int64) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	activeChats, err := store.readActiveChats()
	if err != nil {
		return err
	}

	activeChats[chatID] = false

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

	return activeChats[chatID], nil
}
