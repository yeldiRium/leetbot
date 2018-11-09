import { writeFileSync, readFileSync, existsSync } from 'fs'
import Telegraf from 'telegraf'
import { createStore } from 'redux'

import rootReducer from './reducer'
import { crashHandler } from '../util/telegram'
import {
  startCommand,
  enableCommand,
  disableCommand,
  infoCommand,
  setLanguageCommand,
  reminderInitiative,
  reporterInitiative,
  watchLeetCommand
} from './commands'

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

export default (
  token,
  { dumpFile, ...restConfig },
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

  setInterval(
    () => {
      console.log('dumping state')
      dumpState(dumpFile, store.getState())
    },
    1000
  )

  const commandParams = {
    store,
    i18n,
    config: {
      dumpFile,
      ...restConfig
    }
  }

  const initiativeParams = {
    ...commandParams,
    bot
  }

  // Reminds all enabled groups to post at one minute before leet.
  reminderInitiative(initiativeParams)

  // Reports leeting success after leet.
  reporterInitiative(initiativeParams)

  bot.use(crashHandler)

  bot.start(startCommand(commandParams))

  bot.command('enable', enableCommand(commandParams))

  bot.command('disable', disableCommand(commandParams))

  bot.command('info', infoCommand(commandParams))

  bot.command('setLanguage', setLanguageCommand(commandParams))

  bot.hears(/.*/, watchLeetCommand(commandParams))

  bot.startPolling()
}
