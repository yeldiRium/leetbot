package domain

import (
	"time"
)

type LeetConfiguration struct {
	LeetHour   int
	LeetMinute int
}

func (leetConfiguration LeetConfiguration) IsItCurrentlyLeet(timeZone *time.Location) bool {
	currentTime := time.Now()
	timeInTimeZone := currentTime.In(timeZone)
	return timeInTimeZone.Hour() == leetConfiguration.LeetHour && timeInTimeZone.Minute() == leetConfiguration.LeetMinute
}
