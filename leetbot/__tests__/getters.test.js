import { createStore } from 'redux'
import app from '../reducer'
import { enableChat, updateRecord, abortLeet, restartLeet, addLeetPerson, setLanguage, LANGUAGES } from '../actions'
import { recordInChat, isLeetInChatAborted, isChatActive, enabledChats, leetPeopleInChat, isPersonInChatAlreadyLeet, leetCountInChat, languageInChat } from '../getters'

describe('isChatActive', () => {
  it('returns false for inactive chats', () => {
    const store = createStore(app)

    expect(isChatActive('someInactiveChat', store)).toBeFalse()
  })

  it('returns true for active chats', () => {
    const store = createStore(app)
    const chatId = 'someChat'

    store.dispatch(enableChat(chatId))

    expect(isChatActive(chatId, store)).toBeTrue()
  })
})

describe('enabledChats', () => {
  it('returns a list of enabled chats', () => {
    const store = createStore(app)

    const chatId1 = 'someChatId'
    store.dispatch(enableChat(chatId1))

    const chatId2 = 'someOtherChatId'
    store.dispatch(enableChat(chatId2))

    expect(enabledChats(store)).toEqual([
      chatId1, chatId2
    ])
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

describe('leetPeopleInChat', () => {
  it('returns an empty list per default', () => {
    const store = createStore(app)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))

    expect(leetPeopleInChat(chatId, store)).toEqual([])
  })

  it('returns a list of all leetPeople in order of participation', () => {
    const store = createStore(app)
    const chatId = 'someChatId'
    const leetPeople = [
      'dooderino',
      'dooderina',
      'rändolf'
    ]

    store.dispatch(enableChat(chatId))

    for (const person of leetPeople) {
      store.dispatch(addLeetPerson(person, chatId))
    }

    expect(leetPeopleInChat(chatId, store)).toEqual(leetPeople)
  })
})

describe('isPersonInChatAlreadyLeet', () => {
  it('returns false per default', () => {
    const store = createStore(app)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))

    expect(isPersonInChatAlreadyLeet(chatId, 'somePerson', store)).toBeFalse()
  })

  it('returns true if a person is leet', () => {
    const store = createStore(app)
    const chatId = 'someChatId'
    const person = 'somePerson'

    store.dispatch(enableChat(chatId))
    store.dispatch(addLeetPerson(person, chatId))

    expect(isPersonInChatAlreadyLeet(chatId, person, store)).toBeTrue()
  })
})

describe('leetCountInChat', () => {
  it('returns the number of leetPeople in a chat', () => {
    const store = createStore(app)
    const chatId = 'someChatId'
    const leetPeople = [
      'dooderino',
      'dooderina',
      'rändolf'
    ]

    store.dispatch(enableChat(chatId))

    for (const person of leetPeople) {
      store.dispatch(addLeetPerson(person, chatId))
    }

    expect(leetCountInChat(chatId, store)).toBe(3)
  })
})

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
      [chatId]: {
        leetCounter: {
          leetPeople: [],
          asshole: null
        }
      }
    })

    expect(recordInChat(chatId, store)).toEqual(0)
  })
})

describe('languageInChat', () => {
  it('returns the active language in a chat', () => {
    const store = createStore(app)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))
    store.dispatch(setLanguage(LANGUAGES.en, chatId))

    expect(languageInChat(chatId, store)).toBe(LANGUAGES.en)
  })

  it('throws an exception if the chatId is not found', () => {
    const store = createStore(app)

    expect(() => { languageInChat('someChatId', store) }).toThrow()
  })
})
