import * as R from 'ramda'
import Extra from 'telegraf/extra'

import {
  chatIdInContext,
  messageInContext,
  legibleUserInContext,
  messageIdInContext
} from '../util/telegram'
import { formatHours, formatMinutes } from '../util/time'
import { isChatActive, isPersonInChatAlreadyLeet, recordInChat, isLeetInChatAborted, languageInChat } from './getters'
import { enableChat, disableChat, setLanguage, abortLeet, addLeetPerson, restartLeet } from './actions'
import { isCurrentlyLeet } from './leet'
import { sample } from '../util'

const languageOrDefault = (chatId, store) => {
  if (isChatActive(chatId, store)) {
    return languageInChat(chatId, store)
  }
  return 'de'
}

/*
 * Commands are leetbot-specific middleware factories that all take a number of
 * default arguments. You should always pass the store, i18n and the leetbot
 * config to them.
 */

/**
 * Replies with the start message.
 *
 * @param {i18n: i18next} param0
 */
export const startCommand = ({ i18n }) => ctx => {
  ctx.reply(i18n.t('start'))
}

/**
 * Enables the chat the command is sent from for future leeting.
 *
 * @param {store: Store, i18n: i18next} param0
 */
export const enableCommand = ({ store, i18n }) => ctx => {
  const chatId = chatIdInContext(ctx)
  if (!isChatActive(chatId, store)) {
    store.dispatch(enableChat(chatId))
    ctx.reply(i18n.t('enable chat', { lng: languageInChat(chatId, store) }))
  } else {
    ctx.reply(i18n.t('already enabled', { lng: languageInChat(chatId, store) }))
  }
}

/**
 * Disables the chat the command is sent from from leeting.
 *
 * @param {store: Store, i18n: i18next} param0
 */
export const disableCommand = ({ store, i18n }) => ctx => {
  const chatId = chatIdInContext(ctx)
  if (isChatActive(chatId, store)) {
    const language = languageInChat(chatId, store)
    store.dispatch(disableChat(chatIdInContext(ctx)))
    ctx.reply(i18n.t('disable chat', { lng: language }))
  } else {
    ctx.reply(i18n.t('already disabled'))
  }
}

/**
 * Prints some debug info about the bot and chat the command is sent from.
 *
 * @param {store: Store, config, i18n: i18next} param0
 */
export const infoCommand = ({
  store,
  config: {
    leetHours, leetMinutes, timezone, version, commit
  },
  i18n
}) => ctx => {
  const chatId = chatIdInContext(ctx)
  const lng = languageOrDefault(chatId, store)

  let info = i18n.t('info.currentLanguage', {
    language: lng,
    lng
  }) + '\n'

  if (isChatActive(chatId, store)) {
    info += i18n.t('info.chatActive', { lng })
    info += '\n' + i18n.t(
      'info.currentRecord',
      {
        record: recordInChat(chatId, store),
        lng
      }
    )
  } else {
    info += i18n.t('info.chatInactive', { lng })
  }

  info += '\n' + i18n.t(
    'info.leetTime',
    {
      hours: formatHours(leetHours, timezone),
      minutes: formatMinutes(leetMinutes, timezone),
      timezone,
      lng
    }
  )

  info += '\n' + i18n.t(
    'info.version',
    {
      version,
      commit,
      lng
    }
  )

  ctx.reply(info)
}

/**
 * Sets the language for the bot. This is cross-chat.
 * TODO: change this to be on a chat-basis.
 *
 * @param {store: Store, i18n: i18next} param0
 */
export const setLanguageCommand = ({ store, i18n }) => ctx => {
  const chatId = chatIdInContext(ctx)
  const newLanguage = messageInContext(ctx).split(' ').slice(-1)[0]
  if (R.contains(newLanguage, ['de', 'en'])) {
    store.dispatch(setLanguage(newLanguage, chatId))
    ctx.reply(i18n.t(
      'language changed',
      { lng: languageInChat(chatId, store) }
    ))
  } else {
    ctx.reply(i18n.t('language unknown', {
      language: newLanguage,
      lng: languageInChat(chatId, store)
    }))
  }
}

/**
 * Watches incoming messages during the leet period.
 * Updates the store and tells assholes off if necessary.
 *
 * @param {store: Store, config, i18n: i18next} param0
 */
export const watchLeetCommand = ({
  store,
  i18n,
  config: { leetHours, leetMinutes }
}) => ctx => {
  const message = messageInContext(ctx)
  const chatId = chatIdInContext(ctx)
  const lng = languageOrDefault(chatId, store)

  if (isCurrentlyLeet(leetHours, leetMinutes)) {
    if (isLeetInChatAborted(chatId, store)) {
      return
    }
    const user = legibleUserInContext(ctx)
    if (
      !R.test(/^1337$/, message) ||
      isPersonInChatAlreadyLeet(chatId, user, store)
    ) {
      store.dispatch(abortLeet(user, chatId))

      const insultOptions = i18n.t(
        'callout.asshole',
        { asshole: user, returnObjects: true, lng }
      )
      return ctx.reply(
        sample(insultOptions),
        Extra.inReplyTo(messageIdInContext(ctx))
      )
    }
    return store.dispatch(addLeetPerson(user, chatId))
  }

  if (R.test(/^1337$/, message)) {
    const insultOptions = i18n.t('callout.timing', { returnObjects: true, lng })

    return ctx.reply(
      sample(insultOptions),
      Extra.inReplyTo(messageIdInContext(ctx))
    )
  }
}

/**
 * Dumps the current store state into the chat.
 */
export const debugCommand = ({
  store
}) => ctx => {
  ctx.reply(JSON.stringify(store.getState(), null, 2))
}

/**
 * Resets the state for the current chat.
 */
export const resetCommand = ({
  store,
  i18n
}) => ctx => {
  const chatId = chatIdInContext(ctx)
  const lng = languageOrDefault(chatId, store)
  store.dispatch(restartLeet(chatId))
  ctx.reply(i18n.t('debug.stateReset', { lng }))
}
