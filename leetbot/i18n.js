import i18next from 'i18next'

i18next.init({
  lng: 'de',
  resources: {
    de: {
      translation: {
        'start': 'Hallo i bims, 1 LeetBot. I zaehl euere Leetposts vong Heaufigkiet hern.',
        'enable chat': 'Hallo zusammen! Ich überwache diesen Channel nun. Frohes leeten!',
        'disable chat': 'Leeten ist vorbei. Tschüssi!',
        'callout': {
          'asshole': [
            'DUUU DRECKIGERS STUK SCHEIẞE WARUM MACHST DU SWOWAS\nMACH DES JA NET NOCHMAL DO SCHMOK WAS DA LOS\nALLE AMBARSCH NACH HAUSE LEET ZEIT IS VORBEI WGEEN {{asshole, uppercase}}',
            'OHHHH Mann {{asshole}}, Du hattes genau eine Aufgabe und hast nicht mal das hinbekommen, wie kann man sich als so ein Verlierer noch in der Öffentlichkeit sehen lassen? Wie schwer kann das denn sein?',
            'Als die Intelligenz verteilt wurde war {{asshole}} wohl grade kacken, anders kann ich mir nicht erklären wie man so jämmerlich versagen kann.',
            'EIN MAL UM 13:37 UHR 1337 SCHREIBEN UND SONST DIE FRESSE HALTEN!! Ist es so schwer? Geht wohl nicht in deine Birne rein, {{asshole}}... smh'
          ],
          'timing': [
            'digga hast du eine uhr? mach ma so sachen nicht',
            'das is\' jetzt aber nicht dein Ernst oder? @MeisterRados wäre enttäuscht von dir du lappen',
            'atomuhr.de ist dein freund aber wenn du so weiter machst bald nichtmal mehr das',
            'ob du ne uhr hast?',
            'peter lustig seine oma ist stolz auf dich. fischkopf',
            'ee du otto. is grad echt nich zeit für den spaß lol',
            'Ich bin nicht wütend, ich bin nur enttäuscht.',
            'Wer hat mich schon wieder ohne Grund geweckt?',
            'Je öfter man 1337 schreibt desto witziger wirds... NICHT!',
            'GuCkT mAl HeR lEuTe IcH bIn EiN dEpP uNd WiLl AuFmErKsAmKeIt.',
            'mach den kopf zu, du senfglas',
            'i han mein schnause langsan voll vong deiner plötheit her!',
            'ich hoffe deine eltern versaufen das kindergeld.'
          ]
        },
        'report': {
          'noone': 'Ein trauriger Tag, an dem niemand die 1337 feiert. Schämt euch alle!',
          'leetCount': 'Heute haben wir {{count}} Posts erreicht!',
          'newRecord': 'Fuck yea, das ist ein neuer Rekord! Wir haben uns um {{delta}} gesteigert! 🎉',
          'participant': 'Teilnehmer war: {{participants}}. Bleib stark, du musst uns alle tragen.',
          'participants': 'Teilnehmer waren: {{participants}}.',
          'winner': '1337 |-|4><0R des Tages: {{winner}}!!',
          'congratulations': 'Glückwunsch!'
        },
        'language unknown': 'Sorry, die Sprache "{{language}}" kenne ich nicht.',
        'language changed': 'Ok, ab jetzt schreibe ich Deutsch.',
        'info': {
          'chatActive': 'Ich bin in diesem Chat aktiv. Gib /disable ein, um mich zu deaktivieren.',
          'chatInactive': 'Ich bin in diesen Chat nicht aktiv. Gib /enable ein, um mich zu aktivieren.',
          'leetTime': 'Leet-Time ist um {{hours}}:{{minutes}} in {{- timezone}}.',
          'version': 'Aktuelle Version: {{version}} (Commit: {{commit}})',
          'currentLanguage': 'Aktuelle Sprache: {{language}}',
          'currentRecord': 'Aktueller Rekord: {{record}}'
        },
        'already enabled': 'Ich bin bereits aktiv!',
        'already disabled': 'Ich bin bereits deaktiviert!',
        'error': 'Upsi, irgendwas ist schiefgelaufen. Sag bitte @yeldiR bescheid, damit der Knecht meine Logs checkt.',
        'leet reminder': 'doooods',
        'debug': {
          'stateReset': 'Ich habe versucht, es aus und wieder an zu schalten. Sollte jetzt passen.'
        },
        'countdown': 'T-{{number}}s'
      }
    },
    en: {
      translation: {
        'start': 'Hello, I\'m the LeetBot. I count your leeting.',
        'enable chat': 'Hi everyone! I am now watching this channel. Hayy leeting!',
        'disable chat': 'Leeting is over. Bye!',
        'callout': {
          'asshole': [
            'YOU FUCKING ASSHOLE YOU WHYY DO YOU DO THAT DON\'T DO THAT AGAIN\nEVERYBODY GO HOME LEET TIME IS OVER BECAUSE OF {{asshole, uppercase}}!!1!'
          ],
          'timing': [
            'dood do you have a watch? don\'t do this'
          ]
        },
        'report': {
          'noone': 'T\'is a sad day when noone celebrates the 1337. Shame on all of you!',
          'leetCount': 'Today we reached {{count}} posts!',
          'newRecord': 'Fuck yea, that\'s a new record! That\'s {{delta}} more than last time! 🎉',
          'participant': 'Participant was: {{participants}}. Be strong, you have to carry us all.',
          'participants': 'Participants were: {{participants}}.',
          'winner': 'The winner of the day is: {{winner}}!!',
          'congratulations': 'Congratulations!'
        },
        'language unknown': 'Sorry, I don\'t know the language "{{language}}.',
        'language changed': 'Ok, I\'ll write English from now on.',
        'info': {
          'chatActive': 'I am active in this chat. Enter /disable to deactivate me.',
          'chatInactive': 'I am not active in this. Enter /enable to activate me.',
          'leetTime': 'Leet-Time is at {{hours}}:{{minutes}} in {{- timezone}}.',
          'version': 'Current version: {{version}} (Commit: {{commit}})',
          'currentLanguage': 'Current language: {{language}}',
          'currentRecord': 'Current record: {{record}}'
        },
        'already enabled': 'I\'m already enabled!',
        'already disabled': 'I\'m already disabled!',
        'error': 'Whoops, something went wrong. Please tell @yeldiR to check my logs.',
        'leet reminder': 'doooods',
        'debug': {
          'stateReset': 'I tried turning it off and on again. Should be fine now.'
        },
        'countdown': 'T-{{number}}s'
      }
    }
  },
  interpolation: {
    format: (value, format, lng) => {
      if (format === 'uppercase') {
        return value.toUpperCase()
      }
    }
  }
})

export default i18next
