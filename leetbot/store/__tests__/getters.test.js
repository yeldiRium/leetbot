import {
  recordInChat,
  isLeetInChatAborted,
  isChatActive,
  enabledChats,
  leetPeopleInChat,
  isPersonInChatAlreadyLeet,
  leetCountInChat,
  userScore
} from '../getters'

describe('isChatActive', () => {
  it('returns false for inactive chats', () => {
    const multiChatLeetCounter = {}

    expect(isChatActive('someInactiveChat', multiChatLeetCounter)).toBeFalse()
  })

  it('returns true for active chats', () => {
    const multiChatLeetCounter = {
      'someChat': {}
    }

    expect(isChatActive('someChat', multiChatLeetCounter)).toBeTrue()
  })
})

describe('enabledChats', () => {
  it('returns a list of enabled chats', () => {
    const multiChatLeetCounter = {
      'someChatId': {},
      'someOtherChatId': {}
    }
    expect(enabledChats(multiChatLeetCounter)).toEqual([
      'someChatId', 'someOtherChatId'
    ])
  })
})

describe('isLeetInChatAborted', () => {
  it('returns false in the initial state', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: [],
      record: 0
    }

    expect(isLeetInChatAborted(leetCounter)).toBeFalse()
  })

  it('returns true, if leet was aborted beforehand', () => {
    const leetCounter = {
      asshole: 'someAsshole',
      leetPeople: [],
      record: 0
    }

    expect(isLeetInChatAborted(leetCounter)).toBeTrue()
  })
})

describe('leetPeopleInChat', () => {
  it('returns an empty list per default', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: [],
      record: 42
    }

    expect(leetPeopleInChat(leetCounter)).toEqual([])
  })

  it('returns a list of all leetPeople in order of participation', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: [
        'dooderino',
        'dooderina',
        'rändolf'
      ],
      record: 69
    }
    expect(leetPeopleInChat(leetCounter)).toEqual(leetCounter.leetPeople)
  })
})

describe('isPersonInChatAlreadyLeet', () => {
  it(`returns false if a chat doesn't exist`, () => {
    expect(isPersonInChatAlreadyLeet('somePerson', undefined)).toBeFalse()
  })

  it('returns false per default', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: [],
      record: 3
    }
    expect(isPersonInChatAlreadyLeet('somePerson', leetCounter)).toBeFalse()
  })

  it('returns true if a person is leet', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: ['somePerson'],
      record: 7
    }

    expect(isPersonInChatAlreadyLeet('somePerson', leetCounter)).toBeTrue()
  })
})

describe('leetCountInChat', () => {
  it('returns the number of leetPeople in a chat', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: [
        'dooderino',
        'dooderina',
        'rändolf'
      ],
      record: 5
    }

    expect(leetCountInChat(leetCounter)).toBe(3)
  })
})

describe('recordInChat', () => {
  it('returns 0 for disabled chats', () => {
    expect(recordInChat(undefined)).toBe(0)
  })

  it('retrieves the record for a given chat', () => {
    const leetCounter = {
      asshole: null,
      leetPeople: [],
      record: 7
    }

    expect(recordInChat(leetCounter)).toEqual(7)
  })
})

describe('userScore', () => {
  it('is a function', () => {
    expect(typeof userScore).toBe('function')
  })

  it('returns 0 for an unknown user', () => {
    const userScores = {}

    expect(userScore('someUserId', userScores)).toEqual(0)
  })

  it('returns the score for the given userId', () => {
    const userScores = {
      'someUserId': 0.1337
    }
    expect(userScore('someUserId', userScores)).toEqual(0.1337)
  })
})
