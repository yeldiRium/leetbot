package current_leet

import (
	"encoding/json"
)

type File []byte

func NewDataFile() File {
	return []byte("{}")
}

func (dataFile *File) Parse() (CurrentLeets, error) {
	var fileContent CurrentLeets
	if err := json.Unmarshal(*dataFile, &fileContent); err != nil {
		return nil, err
	}

	return fileContent, nil
}

func (dataFile *File) Set(currentLeets CurrentLeets) error {
	bytes, err := json.Marshal(currentLeets)
	if err != nil {
		return err
	}
	*dataFile = bytes
	return nil
}
