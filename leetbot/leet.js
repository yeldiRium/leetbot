import moment from 'moment-timezone'
import * as R from 'ramda'

import { whenItIsTime } from './timer'
import { enabledChats, isLeetInChatAborted, leetCountInChat, leetPeopleInChat } from './getters'
import { restartLeet } from './actions'

/**
 * Always uses UTC.
 *
 * @param {Int} leetHours
 * @param {Int} leetMinutes
 */
const nextLeets = (leetHours, leetMinutes) => {
  const now = moment()

  // Five second buffer because the bot seems to be ahead a few seconds.
  const beforeLeet = now
    .clone().hour(leetHours).minute(leetMinutes - 1).second(5).millisecond(0)
  if (beforeLeet.isBefore(now)) {
    // Move to next day, if today's reminder is already over.
    beforeLeet.add(1, 'd')
  }
  const leet = beforeLeet.clone().add(1, 'm')
  const afterLeet = leet.clone().add(1, 'm')

  return {
    now,
    beforeLeet,
    leet,
    afterLeet
  }
}

export const isCurrentlyLeet = (leetHours, leetMinutes) => {
  const now = moment()
  return now.hour() === leetHours && now.minute() === leetMinutes
}

/**
 * Starts a regular pre-leet reminder for all enabled chats.
 * Times given are in UTC.
 *
 * @param {*} bot
 * @param {*} store
 * @param {*} i18n
 * @param Int leetHours
 * @param Int leetMinutes
 * @return Promise
 */
export const startReminder = async (bot, store, i18n, leetHours, leetMinutes) => {
  const { beforeLeet, afterLeet } = nextLeets(leetHours, leetMinutes)
  console.log(`starting reminder timer for ${beforeLeet}`)

  await whenItIsTime(beforeLeet)
  const chats = enabledChats(store)
  console.info('reminding chats:', chats)
  /*
   * Remind all chats; Do so by mapping all chat ids to promises and
   * awaiting them in parallel.
   */
  await Promise.all(chats.map(
    async chatId => {
      const chat = await bot.telegram.getChat(chatId)

      if (chat['pinned_message'] !== undefined) {
        const pinnedId = chat['pinned_message']['message_id']
        /*
         * re-pin message after leet, but don't wait for it
         * It doesn't matter if this throws an exception.
         */
        whenItIsTime(afterLeet).then(() => bot.telegram.pinChatMessage(chatId, pinnedId)).catch(console.error)
      }

      // send reminder and pin it
      const { message_id: messageId } = await bot.telegram.sendMessage(chatId, i18n.t('leet reminder'))
      // Prevent crash in case the bot is restricted.
        .catch(() => { })
      try {
        await bot.telegram.pinChatMessage(chatId, messageId)
      } catch (e) {
        /*
         * Pinning is only allowed in channels and super groups. However,
         * handling this exception is unnecessary, since there is no action to
         * take in other kinds of chats.
         */
      }
    }
  ))

  // start next reminder
  return startReminder(bot, store, i18n, leetHours, leetMinutes)
}

/**
 * Starts a regular post-leet report of success for all enabled chats.
 * Times given are in UTC.
 *
 * @param {*} bot
 * @param {*} store
 * @param {*} i18n
 * @param Int leetHours
 * @param Int leetMinutes
 */
export const startReporter = async (bot, store, i18n, leetHours, leetMinutes) => {
  const { afterLeet } = nextLeets(leetHours, leetMinutes)
  console.log(`starting report timer for ${afterLeet}`)

  await whenItIsTime(afterLeet)
  const chats = enabledChats(store)
  console.info('reporting to chats:', chats)
  /*
   * Report to all chats; Do so by mapping all chat ids to promises and
   * awaiting them in parallel.
   */
  await Promise.all(chats.map(
    chatId => {
      return (
        isLeetInChatAborted(chatId, store)
          ? Promise.resolve()
          : bot.telegram.sendMessage(chatId, i18n.t(
            'report leet success',
            {
              count: leetCountInChat(chatId, store),
              participants: R.join(', ', leetPeopleInChat(chatId, store))
            }
          ))
          // Prevent crash in case the bot is restricted.
            .catch(() => {})
      ).then(
        () => store.dispatch(restartLeet(chatId))
      )
    }
  ))

  return startReporter(bot, store, i18n, leetHours, leetMinutes)
}
