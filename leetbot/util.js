import * as R from 'ramda'

const LEET_HOURS = 21
const LEET_MINUTES = 19

const isCurrentlyLeet = () => {
  const now = new Date()
  return (now.getHours() === LEET_HOURS && now.getMinutes() === LEET_MINUTES)
}

const userInContext = R.path(['update', 'message', 'from', 'username'])
const messageInContext = R.path(['update', 'message', 'text'])

const isLeetLegit = (leetPeople, message, user) => {
  return R.test(/^1337$/, message) && !R.contains(user, leetPeople)
}

export {
  isCurrentlyLeet,
  userInContext,
  messageInContext,
  isLeetLegit
}
