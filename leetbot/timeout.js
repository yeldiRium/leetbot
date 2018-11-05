import * as R from 'ramda'

import { isCurrentlyLeet } from './util'

let timeout = null

/**
 * If it is still 13:37, set a new timeout to not interrupt the ongoing leeting.
 * Otherwise post the day's success!
 *
 * @param {*} ctx
 */
const informOrUpdateTimeout = (ctx, counter) => () => {
  if (isCurrentlyLeet()) {
    console.debug('requeueing timeout')
    updateInformationTimeout(ctx, counter)
    return
  }

  ctx.reply(`Today we reached ${counter.count} posts! Participants were: ${R.join(', ', counter.posters)}`)
}

const updateInformationTimeout = (ctx, counter) => {
  abortInformationTimeout()
  console.debug('updating timeout', counter)
  timeout = setTimeout(
    informOrUpdateTimeout(ctx, counter),
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
