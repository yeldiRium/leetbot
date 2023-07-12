package currentleet

import (
	"sync"
)

type CurrentLeetStore struct {
	storeFilePath string
	lock          sync.RWMutex
}

type CurrentLeets map[int64]CurrentLeet

func NewCurrentLeetStore(storeFilePath string) *CurrentLeetStore {
	return &CurrentLeetStore{
		storeFilePath: storeFilePath,
		lock:          sync.RWMutex{},
	}
}

func (store *CurrentLeetStore) readCurrentLeets() (CurrentLeets, error) {
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

func (store *CurrentLeetStore) writeCurrentLeets(activeChats CurrentLeets) error {
	var dataFile File
	if err := dataFile.Set(activeChats); err != nil {
		return err
	}

	return writeDataFile(store.storeFilePath, dataFile)
}

func (store *CurrentLeetStore) AddParticipantToLeet(chatID int64, participant string) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	currentLeets, err := store.readCurrentLeets()
	if err != nil {
		return err
	}

	currentLeet, ok := currentLeets[chatID]

	if !ok {
		currentLeet = CurrentLeet{
			Participants: make([]string, 0),
			IsAborted:    false,
			Asshole:      "",
		}
	}

	if !currentLeet.IsAborted {
		currentLeet.Participants = append(currentLeet.Participants, participant)
	}

	currentLeets[chatID] = currentLeet

	if err := store.writeCurrentLeets(currentLeets); err != nil {
		return err
	}
	return nil
}

func (store *CurrentLeetStore) AbortLeet(chatID int64, asshole string) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	currentLeets, err := store.readCurrentLeets()
	if err != nil {
		return err
	}

	currentLeet, ok := currentLeets[chatID]

	if !ok {
		currentLeet = CurrentLeet{
			Participants: make([]string, 0),
			IsAborted:    false,
			Asshole:      "",
		}
	}

	currentLeet.IsAborted = true
	currentLeet.Asshole = asshole

	currentLeets[chatID] = currentLeet

	if err := store.writeCurrentLeets(currentLeets); err != nil {
		return err
	}
	return nil
}

func (store *CurrentLeetStore) IsAborted(chatID int64) (bool, error) {
	store.lock.RLock()
	defer store.lock.RUnlock()

	currentLeets, err := store.readCurrentLeets()
	if err != nil {
		return false, err
	}

	currentLeet, ok := currentLeets[chatID]

	if !ok {
		return false, nil
	}

	return currentLeet.IsAborted, nil
}

func (store *CurrentLeetStore) GetCurrentLeet(chatID int64) (currentLeet CurrentLeet, ok bool, err error) {
	store.lock.RLock()
	defer store.lock.RUnlock()

	currentLeets, err := store.readCurrentLeets()
	if err != nil {
		return CurrentLeet{}, false, err
	}

	currentLeet, ok = currentLeets[chatID]

	if !ok {
		return CurrentLeet{
			Participants: []string{},
			IsAborted:    false,
			Asshole:      "",
		}, false, nil
	}

	return currentLeet, true, nil
}

func (store *CurrentLeetStore) ResetChat(chatID int64) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	currentLeets, err := store.readCurrentLeets()
	if err != nil {
		return err
	}

	delete(currentLeets, chatID)

	if err := store.writeCurrentLeets(currentLeets); err != nil {
		return err
	}
	return nil
}
