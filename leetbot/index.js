import { writeFileSync, readFileSync, existsSync } from 'fs'
import Telegraf from 'telegraf'
import { createStore } from 'redux'
import scheduler from 'node-schedule'
import moment from 'moment-timezone'

import logger from '../util/logger'
import rootReducer from './reducer'
import { crashHandler } from '../util/telegram'
import {
  startCommand,
  enableCommand,
  disableCommand,
  infoCommand,
  setLanguageCommand,
  watchLeetCommand,
  debugCommand,
  resetCommand
} from './commands'

import i18n from './i18n'
import { reminder, dailyReporter, reOrUnpin, countDown } from './leet'

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
 * Creates a redux store, optionally hydrating from a dumpfile.
 * @param {Function} rootReducer
 * @param {String} dumpFile Path to dumpFile.
 */
const createStoreFromState = (rootReducer, dumpFile) => {
  try {
    return createStore(rootReducer, loadState(dumpFile))
  } catch (error) {
    return createStore(rootReducer)
  }
}

const scheduleJobs = ({
  bot,
  store,
  i18n,
  config: { dumpCron, dumpFile, leetHours, leetMinutes }
}) => {
  scheduler.scheduleJob(dumpCron, () => {
    console.log('dumping state')
    dumpState(dumpFile, store.getState())
  })
  scheduler.scheduleJob(`${leetMinutes - 1} ${leetHours} * * *`, async () => {
    const chats = await reminder(bot, store, i18n)
    scheduler.scheduleJob(
      moment().seconds(0).minutes(leetMinutes + 1).toDate(),
      () => {
        reOrUnpin(bot, chats, i18n)
      }
    )
  })
  scheduler.scheduleJob(`57 ${leetMinutes - 1} ${leetHours} * * *`, () => {
    countDown(bot, store, i18n)
  })
  scheduler.scheduleJob(`${leetMinutes + 1} ${leetHours} * * *`, () => {
    dailyReporter(bot, store, i18n)
  })
}

export default (
  token,
  config,
  telegramOptions
) => {
  // Set up the bot and its store and i18n.
  const bot = new Telegraf(token, telegramOptions)
  const store = createStoreFromState(rootReducer, config.dumpFile)

  // Schedule all important bot-initiated workflows.

  // Register telegram bot middlewares.
  const commandParams = { bot, store, i18n, config }

  scheduleJobs(commandParams)

  bot.use(logger)
  bot.use(crashHandler)
  bot.start(startCommand(commandParams))
  bot.command('enable', enableCommand(commandParams))
  bot.command('disable', disableCommand(commandParams))
  bot.command('info', infoCommand(commandParams))
  bot.command('setLanguage', setLanguageCommand(commandParams))
  bot.command('debug', debugCommand(commandParams))
  bot.command('reset', resetCommand(commandParams))
  bot.hears(/.*/, watchLeetCommand(commandParams))

  // Start the bot.
  bot.startPolling()

  // Notify the admin about the start.
  if (config.admin) {
    bot.telegram.sendMessage(
      config.admin,
      `I have started. My commit is ${config.version}.`
    )
  }
}
