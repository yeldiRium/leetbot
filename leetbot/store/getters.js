import * as R from 'ramda'
import { combineGetters } from '@yeldirium/redux-combine-getters'

import { LANGUAGES } from './actions'

export const enabledChats = multiChatLeetCounter => Object.keys(multiChatLeetCounter)

export const isChatActive = (chatId, chats) => R.has(chatId, chats)

export const isLeetInChatAborted = (state) =>
  !R.isNil(R.prop('asshole', state))

export const leetPeopleInChat = (state) =>
  R.propOr([], 'leetPeople', state)

export const isPersonInChatAlreadyLeet = (person, state) =>
  R.contains(person, leetPeopleInChat(state))

export const leetCountInChat = R.compose(
  R.length,
  leetPeopleInChat
)

export const recordInChat = (chat) => {
  return R.propOr(0, 'record', chat)
}

export const userScore = (userId, state) => {
  return R.propOr(0, userId, state)
}

export default combineGetters({
  multiChatLeetCounter: {
    enabledChats,
    isChatActive,
    '*': {
      leetCounter: {
        isLeetInChatAborted,
        leetPeopleInChat,
        isPersonInChatAlreadyLeet,
        leetCountInChat,
        recordInChat
      },
      language: {
        languageInChat: R.identity,
        languageOrDefault: R.when(R.isNil, R.always(LANGUAGES.de))
      }
    }
  },
  userScores: {
    userScore
  }
})
