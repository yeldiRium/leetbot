import { combineReducers } from 'redux'
import * as R from 'ramda'

import {
  SET_LANGUAGE,
  LANGUAGES,
  ENABLE_CHAT,
  DISABLE_CHAT,
  RESTART_LEET,
  ADD_LEET_PERSON,
  ABORT_LEET,
  UPDATE_RECORD
} from './actions'

const initialLeetCounterState = {
  asshole: null,
  leetPeople: [],
  record: 0
}

const leetCounter = (state = initialLeetCounterState, action) => {
  switch (action.type) {
    case RESTART_LEET:
      return initialLeetCounterState
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

const multiChatLeetCounter = (state = {}, action) => {
  switch (action.type) {
    case ENABLE_CHAT:
      return {
        ...state,
        [action.chatId]: {
          leetCounter: leetCounter(undefined, action)
        }
      }
    case DISABLE_CHAT:
      return {
        ...state,
        [action.chatId]: undefined
      }
    default:
      return R.evolve({
        [action.chatId]: ({ leetCounter: leetCounterState, ...rest }) => ({
          ...rest,
          leetCounter: leetCounter(leetCounterState, action)
        })
      }, state)
  }
}

const language = (state = LANGUAGES.de, action) => {
  if (action.type === SET_LANGUAGE) {
    return action.language
  }
  return state
}

const app = combineReducers({
  chats: multiChatLeetCounter,
  language
})

export default app
export {
  leetCounter,
  multiChatLeetCounter,
  language
}
