import * as R from 'ramda'

const LEET_HOURS = 18
const LEET_MINUTES = 59

const isCurrentlyLeet = () => {
  const now = new Date()
  return (now.getHours() === LEET_HOURS && now.getMinutes() === LEET_MINUTES)
}

const userInContext = R.path(['update', 'message', 'from', 'username'])
const messageInContext = R.path(['update', 'message', 'text'])

const legitLeet = (message, user, posters) => {
  return R.test(/^1337$/, message) && !R.contains(user, posters)
}

export {
  isCurrentlyLeet,
  userInContext,
  messageInContext,
  legitLeet
}
