import Telegraf from 'telegraf'

import logger from '../util/logger'
import { crashHandler } from '../util/telegram'

export default (
  token,
  config,
  telegramOptions
) => {
  // Set up the bot.
  const bot = new Telegraf(token, telegramOptions)

  bot.use(logger)
  bot.use(crashHandler)

  bot.command('start', ctx => {
    ctx.reply('Hello there!')
  })

  // Start the bot.
  bot.startPolling()
}
