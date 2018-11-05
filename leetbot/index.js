import Telegraf from 'telegraf'

import { isCurrentlyLeet } from './util'
import { rootRedux, counterUpdate } from './redux'

let state

const bot = (token, config, telegramOptions) => {
  const bot = new Telegraf(token, telegramOptions)

  bot.start(ctx => {
    ctx.reply('Hallo i bims, 1 LeetBot. I zaehl euere Leetposts vong Heaufigkiet hern.')
  })

  bot.command('debug', ctx => {
    let debug = `Leet-Time is ${config.leetHours}:${config.leetMinutes}.\n`
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

export default bot
