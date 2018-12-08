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

  it('returns 0 if the record is undefined (when migrating)', () => {
    const chatId = 'someChatId'
    const store = createStore(app, {
      chats: {
        [chatId]: {
          leetCounter: {
            leetPeople: [],
            asshole: null
          }
        }
      }
    })

    expect(recordInChat(chatId, store)).toEqual(0)
  })
})
