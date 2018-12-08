import * as R from 'ramda'
import Extra from 'telegraf/extra'

import {
  chatIdInContext,
  messageInContext,
  legibleUserInContext,
  messageIdInContext
} from '../util/telegram'
import { formatHours, formatMinutes } from '../util/time'
import { isChatActive, isPersonInChatAlreadyLeet, recordInChat } from './getters'
import { enableChat, disableChat, setLanguage, abortLeet, addLeetPerson } from './actions'
import { isCurrentlyLeet } from './leet'

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
    ctx.reply(i18n.t('enable chat'))
  } else {
    ctx.reply(i18n.t('already enabled'))
  }
}

/**
 * Disables the chat the command is sent from from leeting.
 *
 * @param {store: Store, i18n: i18next} param0
 */
export const disableCommand = ({ store, i18n }) => ctx => {
  if (isChatActive(chatIdInContext(ctx), store)) {
    store.dispatch(disableChat(chatIdInContext(ctx)))
    ctx.reply(i18n.t('disable chat'))
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

  let info = i18n.t('info.currentLanguage', {
    language: i18n.languages
  }) + '\n'
  if (isChatActive(chatId, store)) {
    info += i18n.t('info.chatActive')
    info += '\n' + i18n.t(
      'info.currentRecord',
      {
        record: recordInChat(chatId, store)
      }
    )
  } else {
    info += i18n.t('info.chatInactive')
  }

  info += '\n' + i18n.t(
    'info.leetTime',
    {
      hours: formatHours(leetHours, timezone),
      minutes: formatMinutes(leetMinutes, timezone),
      timezone
    }
  )

  info += '\n' + i18n.t(
    'info.version',
    {
      version,
      commit
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
  const newLanguage = messageInContext(ctx).split(' ').slice(-1)[0]

  if (R.contains(newLanguage, ['de', 'en'])) {
    i18n.changeLanguage(
      newLanguage,
      (err, t) => {
        if (err) {
          ctx.reply(i18n.t('error'))
        } else {
          ctx.reply(i18n.t('language changed'))
          store.dispatch(setLanguage(newLanguage))
        }
      }
    )
  } else {
    ctx.reply(i18n.t('language unknown', {
      language: newLanguage
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
  if (isCurrentlyLeet(leetHours, leetMinutes)) {
    const message = messageInContext(ctx)
    const chatId = chatIdInContext(ctx)
    const user = legibleUserInContext(ctx)
    if (
      !R.test(/^1337$/, message) ||
      isPersonInChatAlreadyLeet(chatId, user, store)
    ) {
      store.dispatch(abortLeet(user, chatId))
      return ctx.reply(
        i18n.t('call out asshole', { asshole: user }),
        Extra.inReplyTo(messageIdInContext(ctx))
      )
    }
    store.dispatch(addLeetPerson(user, chatId))
  }
}
