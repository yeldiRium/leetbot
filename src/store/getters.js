const { combineGetters } = require("@yeldirium/redux-combine-getters");
const R = require("ramda");

const { LANGUAGES } = require("./actions");

const enabledChats = multiChatLeetCounter => Object.keys(multiChatLeetCounter);

const isChatActive = (chatId, chats) => !R.isNil(R.prop(chatId, chats));

const isLeetInChatAborted = state => !R.isNil(R.prop("asshole", state));

const leetPeopleInChat = state => R.propOr([], "leetPeople", state);

const isPersonInChatAlreadyLeet = (person, state) =>
  R.contains(person, leetPeopleInChat(state));

const leetCountInChat = R.compose(R.length, leetPeopleInChat);

const recordInChat = chat => {
  return R.propOr(0, "record", chat);
};

const userScore = (userId, state) => {
  return R.propOr(0, userId, state);
};

const resolvedGetters = combineGetters({
  multiChatLeetCounter: {
    enabledChats,
    isChatActive,
    "*": {
      leetCounter: {
        isLeetInChatAborted,
        leetPeopleInChat,
        isPersonInChatAlreadyLeet,
        leetCountInChat,
        recordInChat
      },
      language: {
        languageInChat: R.identity,
        languageOrDefault: R.when(R.isNil, R.always(LANGUAGES.de))
      }
    }
  },
  userScores: {
    userScore
  }
});

module.exports = {
  enabledChats,
  getters: resolvedGetters,
  isChatActive,
  isLeetInChatAborted,
  isPersonInChatAlreadyLeet,
  leetCountInChat,
  leetPeopleInChat,
  recordInChat,
  userScore
};
