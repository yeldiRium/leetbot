package activechats

import (
	"encoding/json"
	"time"
)

type ChatConfiguration struct {
	IsActive bool
	TimeZone *time.Location
}

type serializeableChatConfiguration struct {
	IsActive bool   `json:"IsActive"`
	TimeZone string `json:"TimeZone"`
}

func (chatConfiguration ChatConfiguration) MarshalJSON() ([]byte, error) {
	data := serializeableChatConfiguration{
		IsActive: chatConfiguration.IsActive,
		TimeZone: chatConfiguration.TimeZone.String(),
	}
	return json.Marshal(data)
}

func (chatConfiguration *ChatConfiguration) UnmarshalJSON(bytes []byte) error {
	var data serializeableChatConfiguration
	if err := json.Unmarshal(bytes, &data); err != nil {
		return err
	}

	location, err := time.LoadLocation(data.TimeZone)
	if err != nil {
		return err
	}

	chatConfiguration.IsActive = data.IsActive
	chatConfiguration.TimeZone = location
	return nil
}
