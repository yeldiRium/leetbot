import Extra from 'telegraf/extra'

import * as R from 'ramda'

import { userInContext, messageInContext, isLeetLegit } from './util'
import { updateInformationTimeout, abortInformationTimeout } from './timeout'

const startCounterState = () => ({
  isAborted: false,
  leetPeople: []
})

const startState = () => ({
  date: new Date(),
  counter: startCounterState()
})

/**
 * This should only be used to compare timestamps in close proximity, since it
 * only compares their actual day of the month.
 *
 * @param {Date} date
 */
const hasDayPassedSince = date => {
  return date.getDate() !== new Date().getDate()
}

const rootRedux = R.curry((update, state) => {
  console.debug('root redux')

  if (state === undefined || hasDayPassedSince(state.date)) {
    console.log('initializing state')
    state = startState()
  }

  const { date, counter } = state

  return {
    date,
    counter: (update.type === 'COUNTER')
      ? counterRedux(update, counter)
      : counter
  }
})

/**
 * Yes, this reducer has side effects. Deal with it.
 *
 * @param {*} update
 * @param {*} param1
 */
const counterRedux = R.curry((update, { isAborted, leetPeople }) => {
  const message = messageInContext(update.ctx)
  const user = userInContext(update.ctx)

  console.debug('counter redux')

  if (!isAborted) {
    if (isLeetLegit(leetPeople, message, user)) {
      console.info('incrementing')
      const newCounterState = {
        isAborted,
        leetPeople: R.append(user, leetPeople)
      }

      updateInformationTimeout(update.ctx, newCounterState)

      return newCounterState
    }

    console.info('aborting and notifying asshole')
    update.ctx.reply(
      `YOU FUCKING ASSHOLE YOU WHYY DO YOU DO THAT DON'T DO THAT AGAIN\nEVERYBODY GO HOME LEET TIME IS OVER BECAUSE OF ${R.toUpper(user)}`,
      Extra.inReplyTo(R.path(['ctx', 'update', 'message', 'message_id'], update))
    )

    abortInformationTimeout()

    return {
      isAborted: true,
      leetPeople
    }
  }

  return { isAborted, leetPeople }
})

const counterUpdate = ctx => ({
  type: 'COUNTER',
  ctx
})

export {
  rootRedux,
  counterRedux,
  counterUpdate
}
