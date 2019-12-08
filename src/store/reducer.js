const { combineReducers } = require("redux");
const R = require("ramda");

const {
  ABORT_LEET,
  ADD_LEET_PERSON,
  ENABLE_CHAT,
  DISABLE_CHAT,
  LANGUAGES,
  RESTART_LEET,
  SET_LANGUAGE,
  SET_USER_SCORE,
  UPDATE_RECORD
} = require("./actions");

const language = (state = LANGUAGES.de, action) => {
  if (action.type === SET_LANGUAGE) {
    return action.language;
  }
  return state;
};

const initialLeetCounterState = {
  asshole: null,
  leetPeople: [],
  record: 0
};

const leetCounter = (state = initialLeetCounterState, action) => {
  switch (action.type) {
    case RESTART_LEET:
      return {
        ...initialLeetCounterState,
        record: state.record
      };
    case ADD_LEET_PERSON:
      return {
        ...state,
        leetPeople: [...state.leetPeople, action.person]
      };
    case ABORT_LEET:
      return {
        ...state,
        asshole: action.asshole
      };
    case UPDATE_RECORD:
      return {
        ...state,
        record: action.newRecord
      };
    default:
      return state;
  }
};

/**
 * Bundles a leetCounter and a language to a chat.
 * @param {*} state
 * @param {*} action
 */
const chat = combineReducers({
  leetCounter,
  language
});

const userScores = (state = {}, action) => {
  if (action.type === SET_USER_SCORE) {
    return {
      ...state,
      [action.userId]: action.newScore
    };
  }
  return state;
};

const multiChatLeetCounter = (state = {}, action) => {
  switch (action.type) {
    case ENABLE_CHAT:
      return {
        ...state,
        [action.chatId]: chat(undefined, action)
      };
    case DISABLE_CHAT:
      return {
        ...state,
        [action.chatId]: undefined
      };
    default:
      return R.evolve(
        {
          [action.chatId]: R.partialRight(chat, [action])
        },
        state
      );
  }
};

const leetBot = combineReducers({
  multiChatLeetCounter,
  userScores
});

module.exports = {
  chat,
  language,
  leetBot,
  leetCounter,
  multiChatLeetCounter,
  userScores
};
