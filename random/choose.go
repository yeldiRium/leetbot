package random

import "math/rand"

func Choose[T any](options []T) T {
	return options[rand.Intn(len(options))]
}
