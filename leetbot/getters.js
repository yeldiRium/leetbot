import * as R from 'ramda'

export const isChatActive = (chatId, store) =>
  !R.isNil(store.getState()[chatId])

export const enabledChats = store => Object.keys(store.getState())

export const isLeetInChatAborted = (chatId, store) =>
  !R.isNil(R.path([chatId, 'leetCounter', 'asshole'], store.getState()))

export const leetPeopleInChat = (chatId, store) =>
  R.pathOr([], [chatId, 'leetCounter', 'leetPeople'], store.getState())

export const isPersonInChatAlreadyLeet = (chatId, person, store) =>
  R.contains(person, leetPeopleInChat(chatId, store))

export const leetCountInChat = R.compose(
  R.length,
  leetPeopleInChat
)

export const recordInChat = (chatId, store) => {
  const chat = store.getState()[chatId]
  if (chat === undefined) {
    throw new Error(`Chat with id ${chatId} was not found in the store.`)
  }
  return R.pathOr(0, ['leetCounter', 'record'], chat)
}

export const languageInChat = (chatId, store) => {
  const chat = store.getState()[chatId]
  if (chat === undefined) {
    throw new Error(`Chat with id ${chatId} was not found in the store.`)
  }
  return chat.language
}
