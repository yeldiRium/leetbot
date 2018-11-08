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
  chatId: chatId
})

export const disableChat = (chatId) => ({
  type: DISABLE_CHAT,
  chatId: chatId
})

export const restartLeet = (chatId) => ({
  type: RESTART_LEET,
  chatId: chatId
})

export const addLeetPerson = (person, chatId) => ({
  type: ADD_LEET_PERSON,
  person,
  chatId: chatId
})

export const abortLeet = (asshole, chatId) => ({
  type: ABORT_LEET,
  asshole,
  chatId: chatId
})
