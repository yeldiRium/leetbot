import * as R from 'ramda'

export const isChatActive = (chatId, store) =>
  !R.isNil(R.find(
    R.propEq('chatId', chatId),
    store.getState().chats
  ))
