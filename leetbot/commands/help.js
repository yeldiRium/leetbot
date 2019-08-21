import * as R from 'ramda'

import { subCommandInContext, chatIdInContext } from '../../util/telegram'
import getters from '../store/getters'

const { languageOrDefault } = getters

export const listHelpCommand = ({ i18n, store }) => ctx => {
  const lng = languageOrDefault(chatIdInContext(ctx), store)
  ctx.reply(
    i18n.t('available commands', { lng }) + ':\n' +
    Object.keys(subCommands).map(key => {
      return `/help ${key}`
    }).join('\n')
  )
}

export const languageHelpCommand = ({ i18n, store }) => ctx => {
  const lng = languageOrDefault(chatIdInContext(ctx), store)
  const languages = Object.keys(i18n.options.resources)
  ctx.reply(
    i18n.t('language.available', { lng }) + ':\n' +
    languages.map(languageShort =>
      `${i18n.t(`language.list.${languageShort}`, { lng })} - /setLanguage ${languageShort}`
    ).join('\n')
  )
}

/**
 * This list of commands is what builds the output of `/help list` and also what
 * Drives the answers to the individual help commands.
 */
export const subCommands = {
  list: listHelpCommand,
  language: languageHelpCommand
}

/**
 * The /help command.
 * Checks if a subcommand is sent and if so calls it. Otherwise replies with the
 * default help text.
 */
export default ({
  store,
  i18n
}) => ctx => {
  const subCommand = subCommandInContext(ctx)
  const lng = languageOrDefault(chatIdInContext(ctx), store)
  if (!R.either(
    R.isNil,
    R.isEmpty
  )(subCommand)) {
    let [command, ...params] = subCommand.split(' ')

    if (command in subCommands) {
      return subCommands[command]({ store, i18n, params })(ctx)
    }
    return ctx.reply(i18n.t('command unknown', { command, lng }))
  }
  ctx.reply(i18n.t('help'))
}
