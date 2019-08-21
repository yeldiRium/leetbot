export const SET_LANGUAGE = 'SET_LANGUAGE'
export const LANGUAGES = {
  en: 'en',
  de: 'de'
}
export const setLanguage = (language, chatId) => ({
  type: SET_LANGUAGE,
  language,
  chatId
})

export const ENABLE_CHAT = 'ENABLE_CHAT'
export const enableChat = (chatId) => ({
  type: ENABLE_CHAT,
  chatId
})

export const DISABLE_CHAT = 'DISABLE_CHAT'
export const disableChat = (chatId) => ({
  type: DISABLE_CHAT,
  chatId
})

export const RESTART_LEET = 'RESTART_LEET'
export const restartLeet = (chatId) => ({
  type: RESTART_LEET,
  chatId
})

export const ADD_LEET_PERSON = 'ADD_LEET_PERSON'
export const addLeetPerson = (person, chatId) => ({
  type: ADD_LEET_PERSON,
  person,
  chatId
})

export const ABORT_LEET = 'ABORT_LEET'
export const abortLeet = (asshole, chatId) => ({
  type: ABORT_LEET,
  asshole,
  chatId
})

export const UPDATE_RECORD = 'UPDATE_RECORD'
export const updateRecord = (newRecord, chatId) => ({
  type: UPDATE_RECORD,
  newRecord,
  chatId
})

export const SET_USER_SCORE = 'SET_USER_SCORE'
export const setUserScore = (newScore, userId) => ({
  type: SET_USER_SCORE,
  userId,
  newScore
})
