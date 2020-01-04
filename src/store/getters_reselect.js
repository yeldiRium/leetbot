const { createSelector } = require("reselect");
const R = require("ramda");
const { LANGUAGES } = require("./actions");

const chatSelector = chatId => state => state.multiChatLeetCounter[chatId];

const leetCounterSelector = chatId =>
  createSelector([chatSelector(chatId)], chat => chat.leetCounter);

const isChatActive = chatId =>
  createSelector([chatSelector(chatId)], chat => !R.isNil(chat));

// TODO: filter by active
const enabledChatIds = () => state => Object.keys(state.multiChatLeetCounter);

const isLeetInChatAborted = chatId =>
  createSelector(
    [leetCounterSelector(chatId)],
    leetCounter => !R.isNil(leetCounter.asshole)
  );

const leetPeopleInChat = chatId =>
  createSelector(
    [leetCounterSelector(chatId)],
    leetCounter => leetCounter.leetPeople
  );

const isPersonInChatAlreadyLeet = (personName, chatId) =>
  createSelector([leetPeopleInChat(chatId)], leetPeople =>
    leetPeople.includes(personName)
  );
const leetCountInChat = chatId =>
  createSelector([leetPeopleInChat(chatId)], leetPeople => leetPeople.length);

const recordInChat = chatId =>
  createSelector(
    [leetCounterSelector(chatId)],
    leetCounter => leetCounter.record
  );

const userSelector = userId => state => state.userScores[userId];

// TODO: I'M IN PAIN
const userScore = userId =>
  createSelector([userSelector(userId)], user => (R.isNil(user) ? 0 : user));

const languageInChat = chatId =>
  createSelector([chatSelector(chatId)], chat => chat.language);

// FIXME: not responsibility of getter
const languageInChatOrDefault = chatId =>
  createSelector([chatSelector(chatId)], chat =>
    R.isNil(chat) ? LANGUAGES.de : chat.language
  );

module.exports = {
  chatSelector,
  isChatActive,
  enabledChatIds,
  isLeetInChatAborted,
  leetPeopleInChat,
  isPersonInChatAlreadyLeet,
  leetCountInChat,
  recordInChat,
  userSelector,
  userScore,
  languageInChat,
  languageInChatOrDefault
};
