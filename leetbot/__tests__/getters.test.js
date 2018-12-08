import { createStore } from 'redux'
import app from '../reducer'
import { enableChat, updateRecord } from '../actions'
import { recordInChat } from '../getters'

describe('recordInChat', () => {
  it('throws an error for disabled chats', () => {
    const store = createStore(app)
    expect(() => recordInChat('someId', store)).toThrow()
  })

  it('retrieves the record for a given chat', () => {
    const store = createStore(app)
    const chatId = 'someChatId'
    const record = 7

    store.dispatch(enableChat(chatId))
    store.dispatch(updateRecord(record, chatId))

    expect(recordInChat(chatId, store)).toEqual(record)
  })
})
