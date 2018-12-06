import { writeFileSync, readFileSync, existsSync } from 'fs'
import Telegraf from 'telegraf'
import { createStore } from 'redux'
import scheduler from 'node-schedule'
import moment from 'moment-timezone'

import logger from './logger'
import rootReducer from './reducer'
import { crashHandler } from '../util/telegram'
import {
  startCommand,
  enableCommand,
  disableCommand,
  infoCommand,
  setLanguageCommand,
  watchLeetCommand
} from './commands'

import i18n from './i18n'
import { reminder, dailyReporter, reOrUnpin } from './leet'

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
  { dumpFile, dumpCron, leetHours, leetMinutes, timezone, ...restConfig },
  telegramOptions
) => {
  console.log('leetbot starting...')

  const bot = new Telegraf(token, telegramOptions)

  const store = (() => {
    try {
      return createStore(rootReducer, loadState(dumpFile))
    } catch (error) {
      return createStore(rootReducer)
    }
  })()

  i18n.changeLanguage(store.getState().language)

  scheduler.scheduleJob(dumpCron, () => {
    console.log('dumping state')
    dumpState(dumpFile, store.getState())
  })

  scheduler.scheduleJob(`${leetMinutes - 1} ${leetHours} * * *`, async () => {
    const chats = await reminder(bot, store, i18n)
    scheduler.scheduleJob(
      moment().seconds(0).minutes(leetMinutes + 1).toDate(),
      () => reOrUnpin(bot, chats)
    )
  })

  scheduler.scheduleJob(`${leetMinutes + 1} ${leetHours} * * *`, () => {
    dailyReporter(bot, store, i18n)
  })

  const commandParams = {
    store,
    i18n,
    config: {
      dumpFile, dumpCron, leetHours, leetMinutes, timezone, ...restConfig
    }
  }

  bot.use(logger)

  bot.use(crashHandler)

  bot.start(startCommand(commandParams))

  bot.command('enable', enableCommand(commandParams))

  bot.command('disable', disableCommand(commandParams))

  bot.command('info', infoCommand(commandParams))

  bot.command('setLanguage', setLanguageCommand(commandParams))

  bot.hears(/.*/, watchLeetCommand(commandParams))

  bot.startPolling()
}
