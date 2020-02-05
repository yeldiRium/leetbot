const { createSelector } = require("reselect");
const { LANGUAGES } = require("./actions");

const getChat = chatId => state => state.chats[chatId];

const doesChatExist = chatId => state => state.chats[chatId] !== undefined;

const getLeetCounterForChat = chatId =>
  createSelector([getChat(chatId)], chat => chat.leetCounter);

const isChatEnabled = chatId =>
  createSelector([getChat(chatId)], chat => chat !== undefined);

const getEnabledChatIds = () => state => Object.keys(state.chats);

const isLeetInChatAborted = chatId =>
  createSelector(
    [getLeetCounterForChat(chatId)],
    leetCounter => leetCounter.asshole !== null
  );

const getLeetPeopleInChat = chatId =>
  createSelector(
    [getLeetCounterForChat(chatId)],
    leetCounter => leetCounter.leetPeople
  );

const isPersonInChatAlreadyLeet = (personName, chatId) =>
  createSelector([getLeetPeopleInChat(chatId)], leetPeople =>
    leetPeople.includes(personName)
  );
const getLeetCountInChat = chatId =>
  createSelector(
    [getLeetPeopleInChat(chatId)],
    leetPeople => leetPeople.length
  );

const getRecordInChat = chatId =>
  createSelector(
    [getLeetCounterForChat(chatId)],
    leetCounter => leetCounter.record
  );

const getLanguageInChat = chatId =>
  createSelector([getChat(chatId)], chat =>
    chat === undefined ? LANGUAGES.de : chat.language
  );

const getUser = userId => state => state.userScores[userId];

const getUserScore = userId =>
  createSelector([getUser(userId)], user => (user === undefined ? 0 : user));

module.exports = {
  getChat,
  doesChatExist,
  isChatEnabled,
  getEnabledChatIds,
  isLeetInChatAborted,
  getLeetPeopleInChat,
  isPersonInChatAlreadyLeet,
  getLeetCountInChat,
  getRecordInChat,
  getLanguageInChat,
  getUser,
  getUserScore
};
