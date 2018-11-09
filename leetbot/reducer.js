import { combineReducers } from 'redux'
import * as R from 'ramda'

import {
  SET_LANGUAGE,
  LANGUAGES,
  ENABLE_CHAT,
  DISABLE_CHAT,
  RESTART_LEET,
  ADD_LEET_PERSON,
  ABORT_LEET
} from './actions'

const initialLeetCounterState = {
  asshole: null,
  leetPeople: []
}

const leetCounter = (state = initialLeetCounterState, action) => {
  switch (action.type) {
    case RESTART_LEET:
      return initialLeetCounterState
    case ADD_LEET_PERSON:
      return {
        asshole: state.asshole,
        leetPeople: [
          ...state.leetPeople,
          action.person
        ]
      }
    case ABORT_LEET:
      return {
        asshole: action.asshole,
        leetPeople: state.leetPeople
      }
    default:
      return state
  }
}

const multiChatLeetCounter = (state = [], action) => {
  switch (action.type) {
    case ENABLE_CHAT:
      return [
        ...state,
        {
          chatId: action.chatId,
          leetCounter: leetCounter(undefined, action)
        }
      ]
    case DISABLE_CHAT:
      return R.reject(
        R.propEq('chatId', action.chatId),
        state
      )
    default:
      return R.map(
        R.when(
          R.propEq('chatId', action.chatId),
          ({ leetCounter: leetCounterState, ...rest }) => ({
            ...rest,
            leetCounter: leetCounter(leetCounterState, action)
          })
        ),
        state
      )
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
