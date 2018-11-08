import * as R from 'ramda'

import { ENABLE_CHAT, DISABLE_CHAT, RESTART_LEET, ADD_LEET_PERSON, ABORT_LEET } from './actions'

const initialMultiChatLeetCounterState = {
  chats: []
}

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
          R.when(
            R.propEq('chatId', action.chatId),
            ({ leetCounter: leetCounterState, ...rest }) => ({
              ...rest,
              leetCounter: leetCounter(leetCounterState, action)
            })
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
    case ABORT_LEET:
      return {
        asshole: action.asshole,
        leetPeople: state.leetPeople
      }
    default:
      return state
  }
}

export default multiChatLeetCounter
