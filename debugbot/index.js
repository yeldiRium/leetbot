import Telegraf from 'telegraf'
import Extra from 'telegraf/extra'

import * as R from 'ramda'

const messageIdInUpdate = R.path(['message', 'message_id'])

const debugContext = R.pick(['updateType', 'update'])

export default (token, config, telegrafOptions) => {
  const bot = new Telegraf(token, telegrafOptions)

  bot.start(ctx => {
    ctx.reply('This is a debug bot. Write anything, i\'ll debug it.')
  })

  bot.use(ctx => {
    ctx.reply(
      JSON.stringify(debugContext(ctx), null, 2),
      Extra.inReplyTo(messageIdInUpdate(ctx.update))
    )
  })

  bot.startPolling()

  return bot
}
