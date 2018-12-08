/*
 * action types
 */

export const SET_LANGUAGE = 'SET_LANGUAGE'
export const LANGUAGES = {
  en: 'en',
  de: 'de'
}

export const ENABLE_CHAT = 'ENABLE_CHAT'
export const DISABLE_CHAT = 'DISABLE_CHAT'

export const RESTART_LEET = 'RESTART_LEET'
export const ADD_LEET_PERSON = 'ADD_LEET_PERSON'
export const ABORT_LEET = 'ABORT_LEET'
export const UPDATE_RECORD = 'UPDATE_RECORD'

/*
 * actions
 */

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  language
})

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

export const updateRecord = (newRecord, chatId) => ({
  type: UPDATE_RECORD,
  newRecord,
  chatId
})
