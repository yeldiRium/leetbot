package responses

import (
	"github.com/yeldiRium/leetbot/random"
	"strings"
)

var (
	majorInsults = []string{
		"DUUU DRECKIGERS STUK SCHEIẞE WARUM MACHST DU SWOWAS\nMACH DES JA NET NOCHMAL DO SCHMOK WAS DA LOS\nALLE AMBARSCH NACH HAUSE LEET ZEIT IS VORBEI WGEEN {{asshole}}",
		"OHHHH Mann {{asshole}}, Du hattes genau eine Aufgabe und hast nicht mal das hinbekommen, wie kann man sich als so ein Verlierer noch in der Öffentlichkeit sehen lassen? Wie schwer kann das denn sein?",
		"Als die Intelligenz verteilt wurde war {{asshole}} wohl grade kacken, anders kann ich mir nicht erklären wie man so jämmerlich versagen kann.",
		"EIN MAL UM 13:37 UHR 1337 SCHREIBEN UND SONST DIE FRESSE HALTEN!! Ist es so schwer? Geht wohl nicht in deine Birne rein, {{asshole}}... smh",
		"oof",
		"🙃",
	}
)

func GetMajorInsult(asshole string) string {
	insult := random.Choose(majorInsults)

	return strings.Replace(insult, "{{asshole}}", asshole, 1)
}
