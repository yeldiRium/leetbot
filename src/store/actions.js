const SET_LANGUAGE = "SET_LANGUAGE";
const LANGUAGES = {
  en: "en",
  de: "de"
};
const setLanguage = (language, chatId) => ({
  type: SET_LANGUAGE,
  language,
  chatId
});

const ENABLE_CHAT = "ENABLE_CHAT";
const enableChat = chatId => ({
  type: ENABLE_CHAT,
  chatId
});

const DISABLE_CHAT = "DISABLE_CHAT";
const disableChat = chatId => ({
  type: DISABLE_CHAT,
  chatId
});

const RESTART_LEET = "RESTART_LEET";
const restartLeet = chatId => ({
  type: RESTART_LEET,
  chatId
});

const ADD_LEET_PERSON = "ADD_LEET_PERSON";
const addLeetPerson = (person, chatId) => ({
  type: ADD_LEET_PERSON,
  person,
  chatId
});

const ABORT_LEET = "ABORT_LEET";
const abortLeet = (asshole, chatId) => ({
  type: ABORT_LEET,
  asshole,
  chatId
});

const UPDATE_RECORD = "UPDATE_RECORD";
const updateRecord = (newRecord, chatId) => ({
  type: UPDATE_RECORD,
  newRecord,
  chatId
});

const SET_USER_SCORE = "SET_USER_SCORE";
const setUserScore = (newScore, userId) => ({
  type: SET_USER_SCORE,
  userId,
  newScore
});

module.exports = {
  ABORT_LEET,
  ADD_LEET_PERSON,
  DISABLE_CHAT,
  ENABLE_CHAT,
  LANGUAGES,
  RESTART_LEET,
  SET_LANGUAGE,
  SET_USER_SCORE,
  UPDATE_RECORD,
  abortLeet,
  addLeetPerson,
  disableChat,
  enableChat,
  restartLeet,
  setLanguage,
  setUserScore,
  updateRecord
};
