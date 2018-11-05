import Telegraf from 'telegraf'
import Extra from 'telegraf/extra'

import * as R from 'ramda'

const LEET_HOURS = 18
const LEET_MINUTES = 15

const isCurrentlyLeet = () => {
  const now = new Date()
  return (now.getHours() === LEET_HOURS && now.getMinutes() === LEET_MINUTES)
}

/*
 * TODO: replace this shit with typescript enums
 */
const COUNTER_STATES = {
  RUNNING: 'RUNNING',
  ABORTED: 'ABORTED'
}

let state = {
  date: new Date(),
  counter: {
    count: 0,
    state: COUNTER_STATES.RUNNING
  }
}

let timeout = null

/**
 * If it is still 13:37, set a new timeout to not interrupt the ongoing leeting.
 * Otherwise post the day's success!
 *
 * @param {*} ctx
 */
const informOrUpdateTimeout = ctx => () => {
  if (isCurrentlyLeet()) {
    updateInformationTimeout(ctx)
    return
  }

  ctx.reply(`Today we reached ${state.counter.count} posts!`)
}

const updateInformationTimeout = ctx => {
  abortInformationTimeout()
  timeout = setTimeout(
    informOrUpdateTimeout(ctx),
    1000
  )
}

const abortInformationTimeout = () => {
  clearTimeout(timeout)
}

/**
 * This should only be used to compare timestamps in close proximity, since it
 * only compares their actual day of the month.
 *
 * @param {Date} date
 */
const hasDayPassedSince = date => {
  return date.getDate() !== new Date().getDate()
}

const rootRedux = R.curry((update, { date, counter }) => {
  const dayHasPassed = hasDayPassedSince(date)

  return {
    date: dayHasPassed ? new Date() : date,
    counter: dayHasPassed
    // reset state if a day has passed since the last update
      ? counterRedux(update, { count: 0, state: COUNTER_STATES.RUNNING })
      : counterRedux(update, counter)
  }
})

/**
 * Yes, this reducer has side effects. Deal with it.
 *
 * @param {*} update
 * @param {*} param1
 */
const counterRedux = R.curry((update, { count, state }) => {
  const type = R.prop('type')
  if (type === 'INCREMENT' && state === COUNTER_STATES.RUNNING) {
    updateInformationTimeout(update.ctx)

    console.log('incrementing')

    return {
      count: count + 1,
      state
    }
  } else if (type === 'ABORT') {
    console.log('aborting')

    // Reply only to first asshole.
    if (state !== COUNTER_STATES.ABORTED) {
      console.log('notifying asshole')
      update.ctx.reply(
        'YOU FUCKING ASSHOLE YOU WHYY DO YOU DO THAT DON\'T DO THAT AGAIN',
        Extra.inReplyTo(R.path(['ctx', 'update', 'message', 'message_id'], update))
      )
    }

    // clear potentially set timeout
    abortInformationTimeout()

    return {
      count: 0,
      state: COUNTER_STATES.ABORTED
    }
  }

  return { count, state }
})

const incrementUpdate = ctx => ({
  type: 'INCREMENT',
  ctx
})

const abortUpdate = ctx => ({
  type: 'ABORT',
  ctx
})

const bot = token => {
  const bot = new Telegraf(token)

  bot.command('start', ctx => {
    ctx.reply('Welcome to yeldiR\'s test bot! There is nothing here yet!')
  })

  bot.hears(/.*/, ctx => {
    if (isCurrentlyLeet()) {
      state = R.ifElse(
        () => R.path(['update', 'message', 'text'], ctx) === '1337',
        rootRedux(incrementUpdate(ctx)),
        rootRedux(abortUpdate(ctx))
      )(state)
    }
  })

  bot.startPolling()

  return bot
}

export default bot
