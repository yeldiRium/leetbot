import Extra from 'telegraf/extra'

import * as R from 'ramda'

import { userInContext, messageInContext, legitLeet } from './util'
import { updateInformationTimeout, abortInformationTimeout } from './timeout'

/*
 * TODO: replace this shit with typescript enums
 */
const COUNTER_STATES = {
  RUNNING: 'RUNNING',
  ABORTED: 'ABORTED'
}

const startState = () => ({
  date: new Date(),
  counter: {
    count: 0,
    state: COUNTER_STATES.RUNNING,
    posters: []
  }
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
    console.log(state)
    console.log('initializing state')
    state = startState()
  }

  const { date, counter } = state

  return {
    date,
    counter: (update.type === 'COUNTER') ? counterRedux(update, counter) : counter
  }
})

/**
 * Yes, this reducer has side effects. Deal with it.
 *
 * @param {*} update
 * @param {*} param1
 */
const counterRedux = R.curry((update, { count, state, posters }) => {
  const message = messageInContext(update.ctx)
  const user = userInContext(update.ctx)

  console.debug('counter redux')

  if (state === COUNTER_STATES.RUNNING) {
    if (legitLeet(message, user, posters)) {
      console.info('incrementing')
      const newState = {
        count: count + 1,
        state,
        posters: R.append(user, posters)
      }

      updateInformationTimeout(update.ctx, newState)

      return newState
    }

    console.info('aborting and notifying asshole')
    update.ctx.reply(
      'YOU FUCKING ASSHOLE YOU WHYY DO YOU DO THAT DON\'T DO THAT AGAIN',
      Extra.inReplyTo(R.path(['ctx', 'update', 'message', 'message_id'], update))
    )

    abortInformationTimeout()

    return {
      count,
      state: COUNTER_STATES.ABORTED,
      posters
    }
  }

  return { count, state, posters }
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
