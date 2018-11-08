import { writeFileSync, readFileSync, existsSync } from 'fs'
import Telegraf from 'telegraf'
import * as R from 'ramda'
import { createStore } from 'redux'
import rootReducer from './reducer'
import { enableChat, disableChat } from './actions'
import { chatIdInContext, messageInContext } from '../util/telegram'

import i18n from './i18n'

/**
 * Load a startup state from a dump file, if it exists.
 * Otherwise return undefined.
 *
 * @param String fileName
 * @return {*} state
 */
const loadState = (dumpFile) => {
  if (existsSync(dumpFile)) {
    console.info(`loading state from ${dumpFile}`)
    return JSON.parse(readFileSync(dumpFile))
  }
  console.info(`${dumpFile} doesn't exist; starting with empty state`)
  return undefined
}

/**
 * Dump a given state object into a dump file.
 * @param String dumpFile
 * @param {*} state
 */
const dumpState = (dumpFile, state) => writeFileSync(
  dumpFile, JSON.stringify(state), { flag: 'w+' }
)

/**
 * Catch and log any error that might occur further down the line.
 *
 * @param {*} ctx
 * @param {*} next
 */
const crashHandler = (ctx, next) => {
  return next().catch(console.error)
}

export default (token, { chatId, leetHours, leetMinutes, dumpFile }, telegramOptions) => {
  console.log('leetbot starting...')
  const bot = new Telegraf(token, telegramOptions)
  const store = createStore(rootReducer, loadState())

  setInterval(
    () => {
      console.log('dumping state')
      dumpState(dumpFile, store.getState())
    },
    1000
  )

  bot.use(crashHandler)

  bot.start(ctx => {
    ctx.reply(i18n.t('start'))
  })

  bot.command('enable', ctx => {
    store.dispatch(enableChat(chatIdInContext(ctx)))
    ctx.reply(i18n.t('enable chat'))
  })

  bot.command('disable', ctx => {
    store.dispatch(disableChat(chatIdInContext(ctx)))
    ctx.reply(i18n.t('disable chat'))
  })

  bot.command('setLanguage', ctx =>
    i18n.changeLanguage(
      messageInContext(ctx).split(' ').slice(-1)[0],
      (err, t) => {
        if (err) {
          ctx.reply(i18n.t('language unknown'))
          return
        }
        ctx.reply(i18n.t('language changed'))
      }
    )
  )

  bot.startPolling()
}
