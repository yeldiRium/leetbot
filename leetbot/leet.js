import moment from 'moment-timezone'
import * as R from 'ramda'

import { enabledChats, isLeetInChatAborted, leetCountInChat, leetPeopleInChat, recordInChat } from './getters'
import { restartLeet, updateRecord } from './actions'

export const isCurrentlyLeet = (leetHours, leetMinutes) => {
  const now = moment()
  return now.hour() === leetHours && now.minute() === leetMinutes
}

/**
 * Reminds all chat to 1337 soon.
 *
 * @param {*} bot
 * @param {*} store
 * @param {*} i18n
 * @return Promise
 * @resolves {[String, String]} The first is a chatId, the second either unde-
 *  fined or the id of an unpinned message.
 */
export const reminder = async (bot, store, i18n) => {
  const chats = enabledChats(store)
  console.info('reminding chats:', chats)
  /*
   * Remind all chats; Do so by mapping all chat ids to promises and
   * awaiting them in parallel.
   */
  return Promise.all(chats.map(
    async chatId => {
      const chat = await bot.telegram.getChat(chatId)

      const previouslyPinnedMessageId = R.path(
        ['pinned_message', 'message_id'],
        chat
      )

      // send reminder and pin it
      const { message_id: reminderMessageId } = await bot.telegram
        .sendMessage(chatId, i18n.t('leet reminder'))
        // Prevent crash in case the bot is restricted.
        .catch(() => { })
      try {
        await bot.telegram.pinChatMessage(chatId, reminderMessageId)
      } catch (e) {
        /*
         * Pinning is only allowed in channels and super groups. However,
         * handling this exception is unnecessary, since there is no action to
         * take in other kinds of chats.
         */
      }
      return [chatId, previouslyPinnedMessageId]
    }
  ))
}

/**
 * Re-pins unpinned messages or unpins pinned messages.
 * Followup for the reminder.
 *
 * @param {*} bot
 * @param {[[String, String]]} chats
 */
export const reOrUnpin = async (bot, chats) => {
  chats.forEach(([chatId, unPinnedMessageId]) => {
    try {
      if (unPinnedMessageId !== undefined) {
        bot.telegram.pinChatMessage(
          chatId,
          unPinnedMessageId,
          { disable_notification: true }
        )
      } else {
        bot.telegram.unpinChatMessage(chatId)
      }
    } catch (ignored) {
      // Many things could happen here. I don't care about any of them.
    }
  })
}

/**
 * Counts down for three seconds and sends messages to all chats.
 *
 * @param {*} bot
 * @param {*} store
 */
export const countDown = async (bot, store) => {
  const chats = enabledChats(store)

  const send = (chatId, text) => {
    try {
      bot.telegram.sendMessage(chatId, text)
    } catch {
      // idgaf, bot was restricted for some reason.
    }
  }

  chats.forEach(([chatId, ...rest]) => send(chatId, '3'))
  setTimeout(
    () => chats.forEach(([chatId, ...rest]) => send(chatId, '2')),
    1000
  )
  setTimeout(
    () => chats.forEach(([chatId, ...rest]) => send(chatId, '1')),
    2000
  )
}

/**
 * Starts a regular post-leet report of success for all enabled chats.
 * Also restarts the leet counter after reporting.
 * Times given are in UTC.
 *
 * @param {*} bot
 * @param {*} store
 * @param {*} i18n
 */
export const dailyReporter = async (bot, store, i18n) => {
  const chats = enabledChats(store)
  console.info('reporting to chats:', chats)
  /*
   * Report to all chats; Do so by mapping all chat ids to promises and
   * awaiting them in parallel.
   */
  await Promise.all(chats.map(
    async chatId => {
      if (isLeetInChatAborted(chatId, store)) {
        return store.dispatch(restartLeet(chatId))
      }

      const leetPeople = leetPeopleInChat(chatId, store)
      const leetCount = leetCountInChat(chatId, store)
      const previousRecord = recordInChat(chatId, store)

      let report = ''

      report += i18n.t(
        'report.leetCount',
        { count: leetCount }
      ) + '\n\n'

      if (leetCount > previousRecord) {
        store.dispatch(updateRecord(leetCount, chatId))
        report += i18n.t(
          'report.newRecord',
          { delta: leetCount - previousRecord }
        ) + '\n\n'
      }

      report += i18n.t(
        'report.participants',
        { participants: R.join(', ', leetPeople) }
      ) + '\n\n'

      report += i18n.t('report.congratulations')

      await bot.telegram.sendMessage(chatId, report)
        /*
        * This might not work for various reasons. E.g. the bot is restricted in
        * the chat or was kicked from the group without disabling beforehand.
        * Thus detailed error handling makes no sense here.
        */
        .catch(() => {})

      return store.dispatch(restartLeet(chatId))
    }
  ))
}
