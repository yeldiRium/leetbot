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
    if (state === undefined) {
      ctx.reply('State not initialized.')
      return
    }
    ctx.reply(JSON.stringify(state))
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
