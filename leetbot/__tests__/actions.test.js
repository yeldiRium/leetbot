import {
  SET_LANGUAGE,
  LANGUAGES,
  ENABLE_CHAT,
  DISABLE_CHAT,
  RESTART_LEET,
  ADD_LEET_PERSON,
  ABORT_LEET,
  SET_USER_SCORE,
  setLanguage,
  enableChat,
  disableChat,
  restartLeet,
  addLeetPerson,
  abortLeet,
  UPDATE_RECORD,
  updateRecord,
  setUserScore
} from '../actions'

describe('actions', () => {
  test('setLanguage', () => {
    expect(setLanguage(LANGUAGES['en'], 'someChatId'))
      .toEqual({
        type: SET_LANGUAGE,
        language: LANGUAGES['en'],
        chatId: 'someChatId'
      })
  })

  test('enableChat', () => {
    expect(enableChat('someId'))
      .toEqual({
        type: ENABLE_CHAT,
        chatId: 'someId'
      })
  })

  test('disableChat', () => {
    expect(disableChat('someId'))
      .toEqual({
        type: DISABLE_CHAT,
        chatId: 'someId'
      })
  })

  test('restartLeet', () => {
    expect(restartLeet('someId'))
      .toEqual({
        type: RESTART_LEET,
        chatId: 'someId'
      })
  })

  test('addLeetPerson', () => {
    expect(addLeetPerson('somePerson', 'someId'))
      .toEqual({
        type: ADD_LEET_PERSON,
        person: 'somePerson',
        chatId: 'someId'
      })
  })

  test('abortLeet', () => {
    expect(abortLeet('asshole', 'someId'))
      .toEqual({
        type: ABORT_LEET,
        asshole: 'asshole',
        chatId: 'someId'
      })
  })

  test('updateRecord', () => {
    expect(updateRecord(17, 'someId'))
      .toEqual({
        type: UPDATE_RECORD,
        newRecord: 17,
        chatId: 'someId'
      })
  })

  test('setUserScore', () => {
    expect(setUserScore(0.58, 'someUserId'))
      .toEqual({
        type: SET_USER_SCORE,
        userId: 'someUserId',
        newScore: 0.58
      })
  })
})
