import * as R from 'ramda'

import { isCurrentlyLeet, isTimeForReminder } from './util'

let timeout = null

/**
 * If it is still 13:37, set a new timeout to not interrupt the ongoing leeting.
 * Otherwise post the day's success!
 *
 * @param {*} ctx
 * @param {isAborted: boolean, leetPeople: string[]} counterState
 */
const informOrUpdateTimeout = (ctx, counterState) => () => {
  if (isCurrentlyLeet()) {
    console.debug('requeueing timeout')
    updateTimeout(ctx, counterState)
    return
  }

  console.log('posting result')
  // TODO: move string into redux or move both strings into separate module
  ctx.reply(`Today we reached ${R.length(counterState.leetPeople)} posts! Participants were: ${R.join(', ', counterState.leetPeople)}`)
}

const updateTimeout = (ctx, counterState) => {
  abortTimeout()
  timeout = setTimeout(
    informOrUpdateTimeout(ctx, counterState),
    1000
  )
}

const abortTimeout = () => {
  clearTimeout(timeout)
}

const doodReminder = (chatId, tg) => {
  tg.sendMessage(chatId, 'doooods')
    .then(({ message_id: messageId }) => {
      tg.pinChatMessage(chatId, messageId)
    })
}

const sendReminderIfLeet = (chatId, tg) => {
  if (isTimeForReminder()) {
    doodReminder(chatId, tg)
  }
}

export {
  informOrUpdateTimeout,
  abortTimeout,
  sendReminderIfLeet,
  doodReminder
}
