import { createStore } from 'redux'
import app from '../reducer'
import { enableChat, updateRecord, abortLeet, restartLeet } from '../actions'
import { recordInChat, isLeetInChatAborted } from '../getters'

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

describe('isLeetInChatAborted', () => {
  it('returns false in the initial state', () => {
    const store = createStore(app)
    const chatId = 'someChatId'

    store.dispatch(restartLeet(chatId))
    expect(isLeetInChatAborted(chatId, store)).toBeFalse()
  })

  it('returns true, if leet was aborted beforehand', () => {
    const store = createStore(app)
    const chatId = 'someChatId'
    const asshole = 'someAsshole'

    store.dispatch(enableChat(chatId))
    store.dispatch(abortLeet(asshole, chatId))
    expect(isLeetInChatAborted(chatId, store)).toBeTrue()
  })
})
