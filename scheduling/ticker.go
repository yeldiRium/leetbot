package scheduling

import (
	"time"
)

const IntervalPeriod time.Duration = 24 * time.Hour

type Ticker struct {
	C chan bool
}

func getNextTickDuration(minute int) time.Duration {
	now := time.Now()
	nextTick := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), minute, 0, 0, time.Local)
	if nextTick.Before(now) {
		nextTick = nextTick.Add(IntervalPeriod)
	}
	return time.Until(nextTick)
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
