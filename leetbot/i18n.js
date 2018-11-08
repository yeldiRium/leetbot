import i18next from 'i18next'

i18next.init({
  lng: 'de',
  resources: {
    de: {
      translation: {
        'start': 'Hallo i bims, 1 LeetBot. I zaehl euere Leetposts vong Heaufigkiet hern.',
        'enable chat': 'Hallo zusammen! Ich überwache diesen Channel nun. Frohes leeten!',
        'disable chat': 'Leeten ist vorbei. Tschüssi!',
        'call out asshole': 'DUUU DRECKIGERS STUK SCHEIẞE WARUM MACHST DU SWOWAS\nMACH DES JA NET NOCHMAL DO SCHMOK WAS DA LOS\nALLE AMBARSCH NACH HAUSE LEET ZEIT IS VORBEI WGEEN {{asshole, uppercase}}',
        'report leet success': 'Heute haben wir {{count}} Posts erreicht!\nTeilnehmer waren: {{participants}}.\nGlückwunsch an euch!',
        'language unknown': 'Sorry, die Sprache "{{language}}" kenne ich nicht.',
        'language changed': 'Ok, ab jetzt schreibe ich Deutsch.'
      }
    },
    en: {
      translation: {
        'start': 'Hello, I\'m the LeetBot. I count your leeting.',
        'enable chat': 'Hi everyone! I am now watching this channel. Hayy leeting!',
        'disable chat': 'Leeting is over. Bye!',
        'call out asshole': 'YOU FUCKING ASSHOLE YOU WHYY DO YOU DO THAT DON\'T DO THAT AGAIN\nEVERYBODY GO HOME LEET TIME IS OVER BECAUSE OF {{asshole, uppercase}}!!1!',
        'report leet success': 'Today we reached {{count}} posts!\nParticipants were: {{participants}}.\nCongratulations to you all!',
        'language unknown': 'Sorry, I don\'t know the language "{{language}}.',
        'language changed': 'Ok, I\'ll write English from now on.'
      }
    }
  }
})

export default i18next
