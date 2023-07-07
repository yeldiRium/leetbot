package responses

import "fmt"

func GetCongratulations(participants []string, newRecord bool, delta int) string {
	if len(participants) == 0 {
		return "Ein trauriger Tag, an dem niemand die 1337 feiert. Schämt euch alle!"
	}
	if len(participants) == 1 {
		return fmt.Sprintf("Teilnehmer:in war: %s. Bleib stark, du musst uns alle tragen.", participants[0])
	}

	message := fmt.Sprintf("Heute haben wir %d Posts erreicht!\n", len(participants))

	if newRecord {
		message += fmt.Sprintf("Fuck yea, das ist ein neuer Rekord! Wir haben uns um %d gesteigert! 🎉", delta)
	}

	return message
}
