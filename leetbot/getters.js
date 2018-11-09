import * as R from 'ramda'

export const isChatActive = (chatId, store) =>
  !R.isNil(R.prop(chatId, store.getState().chats))

export const enabledChats = store => R.keys(store.getState().chats)

export const isLeetInChatAborted = (chatId, store) =>
  !R.isNil(R.path([chatId, 'leetCounter', 'asshole'], store.getState()))

export const leetPeopleInChat = (chatId, store) =>
  R.pathOr([], [chatId, 'leetCounter', 'leetPeople'], store.getState())

export const leetCountInChat = R.compose(
  R.length,
  leetPeopleInChat
)
