package responses

import "github.com/yeldiRium/leetbot/random"

var (
	insults = []string{
		"digga hast du eine uhr? mach ma so sachen nicht",
		"das is' jetzt aber nicht dein Ernst oder? @MeisterRados wäre enttäuscht von dir du lappen",
		"atomuhr.de ist dein freund aber wenn du so weiter machst bald nichtmal mehr das",
		"ob du ne uhr hast?",
		"peter lustig seine oma ist stolz auf dich. fischkopf",
		"ee du otto. is grad echt nich zeit für den spaß lol",
		"Ich bin nicht wütend, ich bin nur enttäuscht.",
		"Wer hat mich schon wieder ohne Grund geweckt?",
		"Je öfter man 1337 schreibt desto witziger wirds... NICHT!",
		"GuCkT mAl HeR lEuTe IcH bIn EiN dEpP uNd WiLl AuFmErKsAmKeIt.",
		"mach den kopf zu, du senfglas",
		"i han mein schnautse lamgsam voll vong dein plötheit her!",
		"ich hoffe deine eltern versaufen das kindergeld.",
		"kalt.",
		"ganz kalt",
		"du nullnummer... lächerlich",
		"geh mir nicht auf den sack",
		"hast du lack gesoffen?",
		"🅱️rauchst du mal wieder ein paar auf den hintern?",
		"du CDU wähler.",
		"da ist die tür.",
		"💯👌😂😂👌👌😂💯💯💯😂😂💯👌👌😂😂👌👌👌👌💯😂💯👌👌👌👌👌😂😂😂😂💯😂",
		"deine mudda stinkt nach maggi",
		"wir belassen es erstmal bei einer Verwarnung!",
		"wenn wir nochmal kommen müssen, wird das hier alles abgebrochen!",
		"Willkommen im Deppenclub",
		"Vielen Dank für Ihr Abonement der Kackbratzen-Zeitung",
		"Boah ey du bost, was is denn bei dir kaputt?",
		"Michaelschroff seine Oma ist kompetengter als du",
		"oah digga heck off ey ne ey man",
		"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
		"gehirm",
		"ey ne ey amk was jetzt schon wieder",
		"noooooooo you can't just write 1337 when it's not 13:37 😭",
		"ähhhhhhh nein???",
	}
)

func GetInsult() string {
	return random.Choose(insults)
}
