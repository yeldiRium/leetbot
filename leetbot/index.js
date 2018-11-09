import { writeFileSync, readFileSync, existsSync } from 'fs'
import Telegraf from 'telegraf'
import { createStore } from 'redux'
import * as R from 'ramda'

import rootReducer from './reducer'
import { enableChat, disableChat } from './actions'
import { isChatActive } from './getters'
import { chatIdInContext, messageInContext, crashHandler } from '../util/telegram'

import i18n from './i18n'
import { formatHours, formatMinutes } from '../util/time'

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

export default (
  token,
  { chatId, leetHours, leetMinutes, dumpFile, timezone },
  telegramOptions
) => {
  console.log('leetbot starting...')
  const bot = new Telegraf(token, telegramOptions)
  const store = createStore(rootReducer, loadState(dumpFile))

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
    if (!isChatActive(chatIdInContext(ctx), store)) {
      store.dispatch(enableChat(chatIdInContext(ctx)))
      ctx.reply(i18n.t('enable chat'))
    } else {
      ctx.reply(i18n.t('already enabled'))
    }
  })

  bot.command('disable', ctx => {
    if (isChatActive(chatIdInContext(ctx), store)) {
      store.dispatch(disableChat(chatIdInContext(ctx)))
      ctx.reply(i18n.t('disable chat'))
    } else {
      ctx.reply(i18n.t('already disabled'))
    }
  })

  bot.command('info', ctx => {
    let info = i18n.t('current language', {
      language: i18n.languages
    }) + '\n'
    if (isChatActive(chatIdInContext(ctx), store)) {
      info += i18n.t('chat active')
    } else {
      info += i18n.t('chat inactive')
    }

    info += '\n' + i18n.t(
      'leet time',
      {
        hours: formatHours(leetHours, timezone),
        minutes: formatMinutes(leetMinutes, timezone),
        timezone
      }
    )

    ctx.reply(info)
  })

  bot.command('setLanguage', ctx => {
    const newLanguage = messageInContext(ctx).split(' ').slice(-1)[0]

    if (R.contains(newLanguage, ['de', 'en'])) {
      i18n.changeLanguage(
        newLanguage,
        (err, t) => {
          if (err) {
            ctx.reply(i18n.t('error'))
          } else {
            ctx.reply(i18n.t('language changed'))
          }
        }
      )
    } else {
      ctx.reply(i18n.t('language unknown', {
        language: newLanguage
      }))
    }
  })

  bot.startPolling()
}
