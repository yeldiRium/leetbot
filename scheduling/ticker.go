package scheduling

import (
	"time"
)

const INTERVAL_PERIOD time.Duration = 24 * time.Hour

type Ticker struct {
	t *time.Timer
	C chan bool
}

func getNextTickDuration(minute int) time.Duration {
	now := time.Now()
	nextTick := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), minute, 0, 0, time.Local)
	if nextTick.Before(now) {
		nextTick = nextTick.Add(INTERVAL_PERIOD)
	}
	return nextTick.Sub(time.Now())
}

func NewTicker(minute int) Ticker {
	output := make(chan bool)

	go func() {
		for {
			timer := time.NewTimer(getNextTickDuration(minute))
			<-timer.C

			output <- true
		}
	}()
	return Ticker{
		C: output,
	}
}
