import Telegraf from 'telegraf'
import * as R from 'ramda'

import { isCurrentlyLeet } from './util'
import { rootRedux, counterUpdate } from './redux'

let state

const bot = token => {
  const bot = new Telegraf(token)

  bot.command('start', ctx => {
    ctx.reply('Welcome to yeldiR\'s test bot! There is nothing here yet!')
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
