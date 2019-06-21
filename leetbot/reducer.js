import * as R from 'ramda'

import {
  SET_LANGUAGE,
  LANGUAGES,
  ENABLE_CHAT,
  DISABLE_CHAT,
  RESTART_LEET,
  ADD_LEET_PERSON,
  ABORT_LEET,
  UPDATE_RECORD,
  SET_USER_SCORE
} from './actions'

const language = (state = LANGUAGES.de, action) => {
  if (action.type === SET_LANGUAGE) {
    return action.language
  }
  return state
}

const initialLeetCounterState = {
  asshole: null,
  leetPeople: [],
  record: 0
}

const leetCounter = (state = initialLeetCounterState, action) => {
  switch (action.type) {
    case RESTART_LEET:
      return {
        ...initialLeetCounterState,
        record: state.record
      }
    case ADD_LEET_PERSON:
      return {
        ...state,
        leetPeople: [
          ...state.leetPeople,
          action.person
        ]
      }
    case ABORT_LEET:
      return {
        ...state,
        asshole: action.asshole
      }
    case UPDATE_RECORD:
      return {
        ...state,
        record: action.newRecord
      }
    default:
      return state
  }
}

/**
 * Bundles a leetCounter and a language to a chat.
 * @param {*} state
 * @param {*} action
 */
const chat = (state = {}, action) => ({
  leetCounter: leetCounter(state.leetCounter, action),
  language: language(state.language, action)
})

const userScores = (state = {}, action) => {
  if (action.type === SET_USER_SCORE) {
    return {
      ...state,
      [action.userId]: action.newScore
    }
  }
  return state
}

const multiChatLeetCounter = (state = {}, action) => {
  switch (action.type) {
    case ENABLE_CHAT:
      return {
        ...state,
        [action.chatId]: chat(undefined, action)
      }
    case DISABLE_CHAT:
      return {
        ...state,
        [action.chatId]: undefined
      }
    default:
      return R.evolve({
        [action.chatId]: R.partialRight(chat, [action])
      }, state)
  }
}

const leetBotInitialState = {
  multiChatLeetCounter: {},
  userScores: {}
}

const leetBot = (state = leetBotInitialState, action) => {
  return R.evolve({
    multiChatLeetCounter: R.partialRight(multiChatLeetCounter, [action]),
    userScores: R.partialRight(userScores, [action])
  }, state)
}

export default leetBot
export {
  leetCounter,
  multiChatLeetCounter,
  language,
  chat,
  userScores,
  leetBot
}
