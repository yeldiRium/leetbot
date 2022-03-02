const i18next = require("i18next");

i18next.init({
  lng: "de",
  resources: {
    de: {
      translation: {
        deployed:
          "Hallo miteinander. Eine neue Version des Leetbots wurde soeben deployed! Jetzt aktiv ist {{version}}. Frohes Leeten ihr Bobs.",
        callout: {
          asshole: [
            "DUUU DRECKIGERS STUK SCHEIẞE WARUM MACHST DU SWOWAS\nMACH DES JA NET NOCHMAL DO SCHMOK WAS DA LOS\nALLE AMBARSCH NACH HAUSE LEET ZEIT IS VORBEI WGEEN {{asshole, uppercase}}",
            "OHHHH Mann {{asshole}}, Du hattes genau eine Aufgabe und hast nicht mal das hinbekommen, wie kann man sich als so ein Verlierer noch in der Öffentlichkeit sehen lassen? Wie schwer kann das denn sein?",
            "Als die Intelligenz verteilt wurde war {{asshole}} wohl grade kacken, anders kann ich mir nicht erklären wie man so jämmerlich versagen kann.",
            "EIN MAL UM 13:37 UHR 1337 SCHREIBEN UND SONST DIE FRESSE HALTEN!! Ist es so schwer? Geht wohl nicht in deine Birne rein, {{asshole}}... smh",
            "oof",
            "🙃",
          ],
          timing: [
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
          ],
        },
        report: {
          noone:
            "Ein trauriger Tag, an dem niemand die 1337 feiert. Schämt euch alle!",
          leetCount: "Heute haben wir {{count}} Posts erreicht!",
          newRecord:
            "Fuck yea, das ist ein neuer Rekord! Wir haben uns um {{delta}} gesteigert! 🎉",
          participant:
            "Teilnehmer:in war: {{participants}}. Bleib stark, du musst uns alle tragen.",
          participants: "Teilnehmer:innen waren: {{participants}}.",
          winner: "1337 |-|4><0R des Tages: {{winner}}!!",
          congratulations: "Glückwunsch!",
        },
        language: {
          unknown: 'Sorry, die Sprache "{{language}}" kenne ich nicht.',
          changed: "Ok, ab jetzt schreibe ich Deutsch.",
          available: "Folgende Sprachen kenne ich",
          list: {
            de: "Deutsch",
            en: "Englisch",
          },
        },
        info: {
          chatActive:
            "Ich bin in diesem Chat aktiv. Gib /disable ein, um mich zu deaktivieren.",
          chatInactive:
            "Ich bin in diesen Chat nicht aktiv. Gib /enable ein, um mich zu aktivieren.",
          leetTime:
            "Die konfigurierte Leet-Zeit ist {{leetHour}}:{{leetMinute}} in {{- timezone}}.",
          version: "Aktuelle Version: {{version}}",
          currentLanguage: "Aktuelle Sprache: {{language}}",
          currentRecord: "Aktueller Rekord: {{record}}",
        },
        error:
          "Upsi, irgendwas ist schiefgelaufen. Sag bitte @yeldiR bescheid, damit der Knecht meine Logs checkt.",
        "leet reminder": [
          "doooods",
          "Oh Kinder, 13:36! Zeit für ein Leetburger!",
          "@MeisterRados, komm mal leeten!",
          "Die Po1337zei schaut grade weg, wenn ihr jetzt 1337et merken sie es nicht!",
          "Wenn heute wieder nur drei Leute dabei sind, fahr ich mich runter.",
          "Holt mal noch mehr Leute ran, ich will hier mehr 1337 sehen.",
          "ei gude, wie? is gleich 13:37. ich will action hier kinners",
          'hallo hier die regeln: von 13:37:00 bis 13:37:59 exakt einmal "1337" schreiben oder andernfalls ausstoßung und verachtung ertragen',
          "let's play a game",
        ],
        debug: {
          stateReset:
            "Ich habe versucht, es aus und wieder an zu schalten. Sollte jetzt passen.",
        },
        command: {
          unknown:
            'Sorry, den Befehl "{{command}}" kenne ich nicht 😔 Versuch was anderes. Z.B. "/help list"',
          available: "Diese Befehle habe ich auf Lager",
          start:
            "Hallo i bims, 1 LeetBot. I zaehl euere Leetposts vong Heaufigkiet hern.",
          enable: {
            enabled:
              "Hallo zusammen! Ich überwache diesen Channel nun. Frohes leeten!",
            "already enabled": "Ich bin bereits aktiviert!",
          },
          disable: {
            disabled: "Leeten ist vorbei. Tschüssi!",
            "already disabled":
              "Ich bin bereits deaktiviert, du kleines Dummerle!",
          },
          help:
            'Hallo, dies ist die Hilfe. Sie ist aktuell wenig hilfreich. Wirf mal einen Blick auf "/help list" für mehr Infos.',
          setLanguage: {
            "no language given": "Bitte gib eine Sprache ein.",
          },
          score: {
            group:
              "Ey digga pimmel hier mal nicht alle an. Sowas fragt man privat. Ich hab' dich angeschrieben.\n(Vielleicht auch nicht. In dem Fall schreib mich privat erst mit /start an und versuche dann nochmal /score. Du penner.)",
            private:
              "Dein Score ist aktuell {{score}}. Solange du über 1 bist, darfst du nicht an Leet teilnehmen.",
          },
        },
      },
    },
    en: {
      translation: {
        deployed:
          "Hi everyone. A new version of the leetbot was just deployed! Now active is {{version}}. Happy leeting.",
        callout: {
          asshole: [
            "YOU FUCKING ASSHOLE YOU WHYY DO YOU DO THAT DON'T DO THAT AGAIN\nEVERYBODY GO HOME LEET TIME IS OVER BECAUSE OF {{asshole, uppercase}}!!1!",
          ],
          timing: ["dood do you have a watch? don't do this"],
        },
        report: {
          noone:
            "T'is a sad day when noone celebrates the 1337. Shame on all of you!",
          leetCount: "Today we reached {{count}} posts!",
          newRecord:
            "Fuck yea, that's a new record! That's {{delta}} more than last time! 🎉",
          participant:
            "Participant was: {{participants}}. Be strong, you have to carry us all.",
          participants: "Participants were: {{participants}}.",
          winner: "The winner of the day is: {{winner}}!!",
          congratulations: "Congratulations!",
        },
        language: {
          unknown: "Sorry, I don't know the language \"{{language}}.",
          changed: "Ok, I'll write English from now on.",
        },
        info: {
          chatActive:
            "I am active in this chat. Enter /disable to deactivate me.",
          chatInactive:
            "I am not active in this. Enter /enable to activate me.",
          leetTime:
            "The configured leet time is {{leetHour}}:{{leetMinute}} in {{- timezone}}.",
          version: "Current version: {{version}} (Commit: {{commit}})",
          currentLanguage: "Current language: {{language}}",
          currentRecord: "Current record: {{record}}",
        },
        error:
          "Whoops, something went wrong. Please tell @yeldiR to check my logs.",
        "leet reminder": ["doooods", "Oh Kids, 13:36! Time for a leet burger!"],
        debug: {
          stateReset:
            "I tried turning it off and on again. Should be fine now.",
        },
        command: {
          unknown: `Sorry, I don't know the command "{{command}}" 😔 Try something else. E.g. "/help list"`,
          available: "I know these commands:",
          start: "Hello, I'm the LeetBot. I count your leeting.",
          enable: {
            enabled:
              "Hi everyone! I am now watching this channel. Happy leeting!",
            "already enabled": "I'm already enabled!",
          },
          disable: {
            disabled: "Leeting is over. Bye!",
            "already disabled": "I'm already disabled!",
          },
          help:
            'Hi, this is the help. It is currently of little help. Maybe give "/help list" a try.',
          setLanguage: {
            "no language given": "Please enter a language.",
          },
          score: {
            group: `Ey dude don't annoy everyone here. Ask stuff like that privately. I've messaged you. (Or maybe not. In that case message me first with /start and then try /score again. Idiot.)`,
            private:
              "Your current score is {{score}}. As long as you're over 1, you're banned from 1337ing.",
          },
        },
      },
    },
  },
  interpolation: {
    format: (value, format) => {
      if (format === "uppercase") {
        return value.toUpperCase();
      }
    },
  },
});

module.exports = i18next;
