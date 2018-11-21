import {
  SET_LANGUAGE,
  LANGUAGES,
  ENABLE_CHAT,
  DISABLE_CHAT,
  RESTART_LEET,
  ADD_LEET_PERSON,
  ABORT_LEET,
  setLanguage,
  enableChat,
  disableChat,
  restartLeet,
  addLeetPerson,
  abortLeet
} from '../actions'

describe('actions', () => {
  test('setLanguage', () => {
    expect(setLanguage(LANGUAGES['en']))
      .toEqual({
        type: SET_LANGUAGE,
        language: LANGUAGES['en']
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
})
