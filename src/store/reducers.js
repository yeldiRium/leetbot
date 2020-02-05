const { combineReducers } = require("redux");

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

/*
 * Store structure
 *
 * {
 *   // chats reducer
 *   chats: {
 *     [chatId]: {
 *       // leetCounter reducer
 *       leetCounter: {
 *         asshole: string,
 *         leetPeople: string[],
 *         record: number
 *       },
 *       // language reducer
 *       language: string
 *     }
 *   },
 *   // userScores reducer
 *   userScores: {
 *     [userId]: number
 *   }
 * }
 */

const initialLanguage = LANGUAGES.de;
const language = (currentLanguage = initialLanguage, action) => {
  if (action.type === SET_LANGUAGE) {
    return action.language;
  }

  return currentLanguage;
};

const initialLeetCounterState = {
  asshole: null,
  leetPeople: [],
  record: 0
};
const leetCounter = (currentLeetCounter = initialLeetCounterState, action) => {
  switch (action.type) {
    case RESTART_LEET: {
      return {
        asshole: initialLeetCounterState.asshole,
        leetPeople: initialLeetCounterState.leetPeople,
        record: currentLeetCounter.record
      };
    }
    case ADD_LEET_PERSON: {
      return {
        asshole: currentLeetCounter.asshole,
        leetPeople: [...currentLeetCounter.leetPeople, action.person],
        record: currentLeetCounter.record
      };
    }
    case ABORT_LEET: {
      return {
        asshole: action.asshole,
        leetPeople: currentLeetCounter.leetPeople,
        record: currentLeetCounter.record
      };
    }
    case UPDATE_RECORD: {
      return {
        asshole: currentLeetCounter.asshole,
        leetPeople: currentLeetCounter.leetPeople,
        record: action.newRecord
      };
    }
    default: {
      return currentLeetCounter;
    }
  }
};

const chat = combineReducers({
  leetCounter,
  language
});

const userScores = (currentUserScores = {}, action) => {
  if (action.type === SET_USER_SCORE) {
    return {
      ...currentUserScores,
      [action.userId]: action.newScore
    };
  }

  return currentUserScores;
};

const chats = (currentChats = {}, action) => {
  switch (action.type) {
    case ENABLE_CHAT: {
      return {
        ...currentChats,
        [action.chatId]: chat(undefined, action)
      };
    }
    case DISABLE_CHAT: {
      const newChats = { ...currentChats };
      delete newChats[action.chatId];

      return newChats;
    }
    default: {
      // If either the action is not meant for a chat or the chat it is meant
      // for does not exist in the store, ignore the action.
      if (
        action.chatId === undefined ||
        currentChats[action.chatId] === undefined
      ) {
        return currentChats;
      }

      const newChats = {
        ...currentChats,
        [action.chatId]: chat(currentChats[action.chatId], action)
      };

      return newChats;
    }
  }
};

const leetBot = combineReducers({
  chats,
  userScores
});

module.exports = {
  chat,
  language,
  leetBot,
  leetCounter,
  chats,
  userScores
};
