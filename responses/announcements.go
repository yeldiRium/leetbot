package responses

import (
	"github.com/yeldiRium/leetbot/utils/random"
)

var (
	announcements = []string{
		"doooods",
		"Oh Kinder, 13:36! Zeit für ein Leetburger!",
		"@MeisterRados, komm mal leeten!",
		"Die Po1337zei schaut grade weg, wenn ihr jetzt 1337et merken sie es nicht!",
		"Wenn heute wieder nur drei Leute dabei sind, fahr ich mich runter.",
		"Holt mal noch mehr Leute ran, ich will hier mehr 1337 sehen.",
		"ei gude, wie? is gleich 13:37. ich will action hier kinners",
		"hallo hier die regeln: von 13:37:00 bis 13:37:59 exakt einmal \"1337\" schreiben oder andernfalls ausstoßung und verachtung ertragen",
		"let's play a game",
	}
)

func GetAnnouncement() string {
	return random.Choose(announcements)
}
