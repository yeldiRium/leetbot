import * as R from 'ramda'

import { isCurrentlyLeet } from './util'

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
    updateInformationTimeout(ctx, counterState)
    return
  }

  ctx.reply(`Today we reached ${R.length(counterState.leetPeople)} posts! Participants were: ${R.join(', ', counterState.leetPeople)}`)
}

const updateInformationTimeout = (ctx, counterState) => {
  abortInformationTimeout()
  console.debug('updating timeout', counterState)
  timeout = setTimeout(
    informOrUpdateTimeout(ctx, counterState),
    1000
  )
}

const abortInformationTimeout = () => {
  console.debug('aborting timeout')
  clearTimeout(timeout)
}

export {
  updateInformationTimeout,
  abortInformationTimeout
}
