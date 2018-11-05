import Telegraf from 'telegraf'

import { isCurrentlyLeet } from './util'
import { rootRedux, counterUpdate } from './redux'

let state

const bot = (token, options) => {
  const bot = new Telegraf(token, options)

  bot.start(ctx => {
    ctx.reply('Hallo i bims, 1 LeetBot. I zaehl euere Leetposts vong Heaufichkiet hern.')
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
