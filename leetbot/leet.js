import moment from 'moment-timezone'
import * as R from 'ramda'

import { enabledChats, isLeetInChatAborted, leetCountInChat, leetPeopleInChat, recordInChat, languageInChat } from './getters'
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

      try {
        // send reminder
        const { message_id: reminderMessageId } = await bot.telegram
          .sendMessage(
            chatId,
            i18n.t('leet reminder', { lng: languageInChat(chatId, store) })
          )
        // and pin it
        await bot.telegram.pinChatMessage(chatId, reminderMessageId)
      } catch (e) {
        /*
         * Pinning is only allowed in channels and super groups. However,
         * handling this exception is unnecessary, since there is no action to
         * take in other kinds of chats.
         */
        console.log(`bot could not send or pin message in ${chatId}.`)
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
  console.log('re- or unpinning...')
  chats.forEach(([chatId, unPinnedMessageId]) => {
    console.log([chatId, unPinnedMessageId])
    try {
      if (unPinnedMessageId !== undefined) {
        console.log(`repinning ${unPinnedMessageId} in ${chatId}`)
        bot.telegram.pinChatMessage(
          chatId,
          unPinnedMessageId,
          { disable_notification: true }
        )
      } else {
        console.log(`unpinning in ${chatId}`)
        bot.telegram.unpinChatMessage(chatId)
      }
    } catch (ignored) {
      console.log(`bot could not pin or unpin message in ${chatId}.`)
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
  const broadcastMessage = (message) => {
    for (const chatId of enabledChats(store)) {
      try {
        bot.telegram.sendMessage(
          chatId,
          message
        )
      } catch {
        console.log(`bot could not send message to ${chatId}.`)
      }
    }
  }

  broadcastMessage('T-3s')
  setTimeout(() => broadcastMessage('T-2s'), 1000)
  setTimeout(() => broadcastMessage('T-1s'), 2000)
  setTimeout(() => broadcastMessage('1337'), 3000)
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
      const language = languageInChat(chatId, store)

      let report = ''

      if (leetCount === 0) {
        report = i18n.t('noone')
      } else {
        report += i18n.t(
          'report.leetCount',
          {
            count: leetCount,
            lng: language
          }
        ) + '\n\n'

        if (leetCount > previousRecord) {
          store.dispatch(updateRecord(leetCount, chatId))
          report += i18n.t(
            'report.newRecord',
            {
              delta: leetCount - previousRecord,
              lng: language
            }
          ) + '\n\n'
        }

        if (leetCount === 1) {
          report += i18n.t(
            'report.participant',
            {
              participants: leetPeople[0],
              lng: language
            }
          ) + '\n\n'
        } else {
          report += i18n.t(
            'report.participants',
            {
              participants: R.join(', ', leetPeople),
              lng: language
            }
          ) + '\n\n'
        }

        report += i18n.t('report.congratulations', { lng: language })
      }

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
