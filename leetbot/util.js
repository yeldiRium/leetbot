import * as R from 'ramda'

import { loadConfig } from '../config'

const { leetbot } = loadConfig()

const isTimeForReminder = () => {
  const now = new Date()
  return (
    now.getHours() === leetbot.config.leetHours &&
    now.getMinutes() === (leetbot.config.leetMinutes - 1)
  )
}

const isCurrentlyLeet = () => {
  const now = new Date()
  return (
    now.getHours() === leetbot.config.leetHours &&
    now.getMinutes() === leetbot.config.leetMinutes
  )
}

const userInContext = R.path(['update', 'message', 'from'])
const messageInContext = R.path(['update', 'message', 'text'])

const isLeetLegit = (leetPeople, message, user) => {
  return R.test(/^1337$/, message) && !R.contains(user, leetPeople)
}

const leftPad = (stringCastable) => {
  const string = String(stringCastable)
  return string.padStart.bind(string)
}

export {
  isCurrentlyLeet,
  isTimeForReminder,
  userInContext,
  messageInContext,
  isLeetLegit,
  leftPad
}
