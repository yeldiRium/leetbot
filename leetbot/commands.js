import * as R from 'ramda'
import Extra from 'telegraf/extra'

import {
  chatIdInContext,
  messageInContext,
  legibleUserInContext,
  messageIdInContext
} from '../util/telegram'
import { formatHours, formatMinutes } from '../util/time'
import { isChatActive, isPersonInChatAlreadyLeet } from './getters'
import { enableChat, disableChat, setLanguage, abortLeet, addLeetPerson } from './actions'
import { isCurrentlyLeet, dailyReporter, dailyReminder } from './leet'

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
export const infoCommand = ({ store, config: { leetHours, leetMinutes, timezone }, i18n }) => ctx => {
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

/*
 * Initiatives take the bot as an argument instead of a context, since they are
 * active by themselves.
 * They use the bot to send messages on their own command.
 */

/**
  * Reminds all enabled chats to post at one minute before leet by posting a
  * message and pinning it.
  * If a message was already pinned, it is stored and restored after leet.
  *
  * The reminder will reset itself for each following day.
  *
  * @param {bot: Telegraf, store: Store, i18n: i18next, config} param0
  * @return Promise
  */
export const reminderInitiative = ({
  bot,
  store,
  i18n,
  config: { leetHours, leetMinutes, timezone }
}) => {
  return dailyReminder(bot, store, i18n, leetHours, leetMinutes, timezone)
}

/**
 * Reports the day's work to all enabled chats, if they did not abort.
 *
 * @param {bot: Telegraf, store: Store, i18n: i18next, config} param0
 */
export const reporterInitiative = ({
  bot,
  store,
  i18n,
  config: { leetHours, leetMinutes, timezone }
}) => {
  return dailyReporter(bot, store, i18n, leetHours, leetMinutes, timezone)
}
