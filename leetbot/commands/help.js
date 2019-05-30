import * as R from 'ramda'

import { subCommandInContext } from '../../util/telegram'

export const listHelpCommand = ({ i18n }) => ctx => {
  ctx.reply(
    i18n.t('available commands') + ':\n' +
    Object.keys(subCommands).map(key => {
      return `/help ${key}`
    }).join('\n')
  )
}

export const languageHelpCommand = ({ i18n }) => ctx => {
  const languages = Object.keys(i18n.options.resources)
  ctx.reply(
    i18n.t('language.available') + ':\n' +
    languages.map(languageShort =>
      `${i18n.t(`language.list.${languageShort}`)} - /setLanguage ${languageShort}`
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
  if (!R.either(
    R.isNil,
    R.isEmpty
  )(subCommand)) {
    let [command, ...params] = subCommand.split(' ')

    if (command in subCommands) {
      return subCommands[command]({ i18n, params })(ctx)
    }
    return ctx.reply(i18n.t('command unknown', { command }))
  }
  ctx.reply(i18n.t('help'))
}
