import Telegraf from 'telegraf'

import { isCurrentlyLeet, leftPad } from './util'
import { rootRedux, counterUpdate } from './redux'
import { sendReminderIfLeet } from './timeout'

let state

export default (token, { chatId, leetHours, leetMinutes }, telegramOptions) => {
  const bot = new Telegraf(token, telegramOptions)

  // check every minute if reminder needs to be sent
  setInterval(() => {
    sendReminderIfLeet(chatId, bot.telegram)
  }, 60000)

  bot.start(ctx => {
    ctx.reply('Hallo i bims, 1 LeetBot. I zaehl euere Leetposts vong Heaufigkiet hern.')
  })

  bot.command('debug', ctx => {
    // Fucking timezones.
    let debug = `Leet-Time is ${leftPad(leetHours + 1)(2, '0')}:${leftPad(leetMinutes)(2, '0')}.\n`
    if (state === undefined) {
      debug += 'State not initialized.'
    } else {
      debug += JSON.stringify(state)
    }
    ctx.reply(debug)
  })

  bot.hears(/.*/, ctx => {
    if (isCurrentlyLeet()) {
      state = rootRedux(counterUpdate(ctx), state)
    }
  })

  bot.startPolling()

  return bot
}
