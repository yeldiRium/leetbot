import * as R from 'ramda'

import { ENABLE_CHAT, DISABLE_CHAT, RESTART_LEET, ADD_LEET_PERSON } from './actions'

const initialMultiChatLeetCounterState = {
  chats: []
}

const chatLeetCounterLens = R.lensProp('leetCounter')

const multiChatLeetCounter = (state = initialMultiChatLeetCounterState, action) => {
  switch (action.type) {
    case ENABLE_CHAT:
      return {
        chats: [
          ...state.chats,
          {
            chatId: action.chatId,
            leetCounter: leetCounter(undefined, action)
          }
        ]
      }
    case DISABLE_CHAT:
      return {
        chats: R.reject(
          R.propEq('chatId', action.chatId),
          state.chats
        )
      }
    default:
      return {
        chats: R.map(
          chat => R.over(
            chatLeetCounterLens,
            R.flip(leetCounter)(action)
          ),
          state.chats
        )
      }
  }
}

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
    default:
      return state
  }
}

export default multiChatLeetCounter
