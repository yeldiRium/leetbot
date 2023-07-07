package current_leet

import (
	"encoding/json"
)

type File []byte

func NewDataFile() File {
	return []byte("{}")
}

func (dataFile *File) Parse() (ActiveChats, error) {
	var fileContent ActiveChats
	if err := json.Unmarshal(*dataFile, &fileContent); err != nil {
		return nil, err
	}

	return fileContent, nil
}

func (dataFile *File) Set(activeChats ActiveChats) error {
	bytes, err := json.Marshal(activeChats)
	if err != nil {
		return err
	}
	*dataFile = bytes
	return nil
}
