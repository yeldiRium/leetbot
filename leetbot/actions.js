/*
 * action types
 */

export const ENABLE_CHAT = 'ENABLE_CHAT'
export const DISABLE_CHAT = 'DISABLE_CHAT'

export const RESTART_LEET = 'RESTART_LEET'
export const ADD_LEET_PERSON = 'ADD_LEET_PERSON'
export const ABORT_LEET = 'ABORT_LEET'

/*
 * actions
 */

export const enableChat = (chatId) => ({
  type: ENABLE_CHAT,
  chatId
})

export const disableChat = (chatId) => ({
  type: DISABLE_CHAT,
  chatId
})

export const restartLeet = (chatId) => ({
  type: RESTART_LEET,
  chatId
})

export const addLeetPerson = (person, chatId) => ({
  type: ADD_LEET_PERSON,
  person,
  chatId
})

export const abortLeet = (asshole, chatId) => ({
  type: ABORT_LEET,
  asshole,
  chatId
})
