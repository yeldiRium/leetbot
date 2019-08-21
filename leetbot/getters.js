import * as R from 'ramda'
import { combineGetters } from '@yeldirium/redux-combine-getters'

export const isChatActive = (chatId, state) => !R.isNil(state[chatId])

export const enabledChats = state => Object.keys(state)

export const isLeetInChatAborted = (chatId, state) =>
  !R.isNil(R.path([chatId, 'leetCounter', 'asshole'], state))

export const leetPeopleInChat = (chatId, state) =>
  R.pathOr([], [chatId, 'leetCounter', 'leetPeople'], state)

export const isPersonInChatAlreadyLeet = (chatId, person, state) =>
  R.contains(person, leetPeopleInChat(chatId, state))

export const leetCountInChat = R.compose(
  R.length,
  leetPeopleInChat
)

export const recordInChat = (chatId, state) => {
  const chat = state[chatId]
  if (chat === undefined) {
    throw new Error(`Chat with id ${chatId} was not found in the state.`)
  }
  return R.pathOr(0, ['leetCounter', 'record'], chat)
}

export const languageInChat = (chatId, state) => {
  const chat = state[chatId]
  if (chat === undefined) {
    throw new Error(`Chat with id ${chatId} was not found in the state.`)
  }
  return chat.language
}

export const languageOrDefault = (chatId, state) => {
  if (isChatActive(chatId, state)) {
    return languageInChat(chatId, state)
  }
  return 'de'
}

export const userScore = (userId, state) => {
  return R.propOr(0, userId, state)
}

export default combineGetters({
  multiChatLeetCounter: {
    isChatActive,
    enabledChats,
    isLeetInChatAborted,
    leetPeopleInChat,
    isPersonInChatAlreadyLeet,
    leetCountInChat,
    recordInChat,
    languageInChat,
    languageOrDefault
  },
  userScores: {
    userScore
  }
})
