import * as R from 'ramda'

export const isChatActive = (chatId, store) =>
  !R.isNil(R.prop(chatId, store.getState().chats))

export const enabledChats = store => R.keys(store.getState().chats)

export const isLeetInChatAborted = (chatId, store) =>
  !R.isNil(R.path(['chats', chatId, 'leetCounter', 'asshole'], store.getState()))

export const leetPeopleInChat = (chatId, store) =>
  R.pathOr([], ['chats', chatId, 'leetCounter', 'leetPeople'], store.getState())

export const isPersonInChatAlreadyLeet = (chatId, person, store) =>
  R.contains(person, leetPeopleInChat(chatId, store))

export const leetCountInChat = R.compose(
  R.length,
  leetPeopleInChat
)

export const recordInChat = (chatId, store) => {
  const chat = R.path(['chats', chatId], store.getState())
  if (chat === undefined) {
    throw new Error(`Chat with id ${chatId} was not found in the store.`)
  }
  return R.pathOr(0, ['leetCounter', 'record'], chat)
}
