import { createStore } from 'redux'
import { multiChatLeetCounter, userScores } from '../reducer'
import {
  enableChat,
  updateRecord,
  abortLeet,
  restartLeet,
  addLeetPerson,
  setLanguage,
  LANGUAGES,
  setUserScore
} from '../actions'
import {
  recordInChat,
  isLeetInChatAborted,
  isChatActive,
  enabledChats,
  leetPeopleInChat,
  isPersonInChatAlreadyLeet,
  leetCountInChat,
  languageInChat,
  languageOrDefault,
  userScore
} from '../getters'

describe('isChatActive', () => {
  it('returns false for inactive chats', () => {
    const store = createStore(multiChatLeetCounter)

    expect(isChatActive('someInactiveChat', store.getState())).toBeFalse()
  })

  it('returns true for active chats', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChat'

    store.dispatch(enableChat(chatId))

    expect(isChatActive(chatId, store.getState())).toBeTrue()
  })
})

describe('enabledChats', () => {
  it('returns a list of enabled chats', () => {
    const store = createStore(multiChatLeetCounter)

    const chatId1 = 'someChatId'
    store.dispatch(enableChat(chatId1))

    const chatId2 = 'someOtherChatId'
    store.dispatch(enableChat(chatId2))

    expect(enabledChats(store.getState())).toEqual([
      chatId1, chatId2
    ])
  })
})

describe('isLeetInChatAborted', () => {
  it('returns false in the initial state', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'

    store.dispatch(restartLeet(chatId))
    expect(isLeetInChatAborted(chatId, store.getState())).toBeFalse()
  })

  it('returns true, if leet was aborted beforehand', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'
    const asshole = 'someAsshole'

    store.dispatch(enableChat(chatId))
    store.dispatch(abortLeet(asshole, chatId))
    expect(isLeetInChatAborted(chatId, store.getState())).toBeTrue()
  })
})

describe('leetPeopleInChat', () => {
  it('returns an empty list per default', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))

    expect(leetPeopleInChat(chatId, store.getState())).toEqual([])
  })

  it('returns a list of all leetPeople in order of participation', () => {
    const store = createStore(multiChatLeetCounter)
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

    expect(leetPeopleInChat(chatId, store.getState())).toEqual(leetPeople)
  })
})

describe('isPersonInChatAlreadyLeet', () => {
  it('returns false per default', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))

    expect(isPersonInChatAlreadyLeet(chatId, 'somePerson', store.getState())).toBeFalse()
  })

  it('returns true if a person is leet', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'
    const person = 'somePerson'

    store.dispatch(enableChat(chatId))
    store.dispatch(addLeetPerson(person, chatId))

    expect(isPersonInChatAlreadyLeet(chatId, person, store.getState())).toBeTrue()
  })
})

describe('leetCountInChat', () => {
  it('returns the number of leetPeople in a chat', () => {
    const store = createStore(multiChatLeetCounter)
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

    expect(leetCountInChat(chatId, store.getState())).toBe(3)
  })
})

describe('recordInChat', () => {
  it('throws an error for disabled chats', () => {
    const store = createStore(multiChatLeetCounter)
    expect(() => recordInChat('someId', store.getState())).toThrow()
  })

  it('retrieves the record for a given chat', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'
    const record = 7

    store.dispatch(enableChat(chatId))
    store.dispatch(updateRecord(record, chatId))

    expect(recordInChat(chatId, store.getState())).toEqual(record)
  })

  it('returns 0 if the record is undefined (when migrating)', () => {
    const chatId = 'someChatId'
    const store = createStore(multiChatLeetCounter, {
      [chatId]: {
        leetCounter: {
          leetPeople: [],
          asshole: null
        }
      }
    })

    expect(recordInChat(chatId, store.getState())).toEqual(0)
  })
})

describe('languageInChat', () => {
  it('returns the active language in a chat', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))
    store.dispatch(setLanguage(LANGUAGES.en, chatId))

    expect(languageInChat(chatId, store.getState())).toBe(LANGUAGES.en)
  })

  it('throws an exception if the chatId is not found', () => {
    const store = createStore(multiChatLeetCounter)

    expect(() => { languageInChat('someChatId', store.getState()) }).toThrow()
  })
})

describe('languageOrDefault', () => {
  it('is a function', () => {
    expect(typeof languageOrDefault).toBe('function')
  })

  it('returns the language in the chat', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'

    store.dispatch(enableChat(chatId))
    store.dispatch(setLanguage(LANGUAGES.en, chatId))

    expect(languageOrDefault(chatId, store.getState())).toBe(LANGUAGES.en)
  })

  it('returns de if the chatId is not found in the store', () => {
    const store = createStore(multiChatLeetCounter)
    const chatId = 'someChatId'

    expect(languageOrDefault(chatId, store.getState())).toBe('de')
  })
})

describe('userScore', () => {
  it('is a function', () => {
    expect(typeof userScore).toBe('function')
  })

  it('returns 0 for an unknown user', () => {
    const store = createStore(userScores)

    expect(userScore('someUserId', store.getState())).toEqual(0)
  })

  it('returns the score for the given userId', () => {
    const store = createStore(userScores)
    const userId = 'someUserId'

    store.dispatch(setUserScore(0.1337, userId))

    expect(userScore(userId, store.getState())).toEqual(0.1337)
  })
})
