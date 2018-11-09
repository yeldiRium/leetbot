import * as R from 'ramda'

export const isChatActive = (chatId, store) =>
  !R.isNil(R.prop(chatId, store.getState().chats))
