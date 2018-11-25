import i18next from 'i18next'
import { createStore } from 'redux'

import rootReducer from '../reducer'
import { startCommand, enableCommand, disableCommand, setLanguageCommand } from '../commands'
import { enableChat, disableChat, setLanguage } from '../actions'

describe('commands', () => {
  describe('startCommand', () => {
    it('replies with the start label from i18n', () => {
      const i18n = i18next.createInstance({
        lng: 'en',
        resources: { en: { translation: { start: 'start label' } } }
      }).init()

      const mockCtx = {
        reply: jest.fn()
      }

      startCommand({ i18n })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('start label')
    })
  })

  describe('enableCommand', () => {
    const i18n = i18next.createInstance({
      lng: 'en',
      resources: { en: { translation: {
        'enable chat': 'enable chat label',
        'already enabled': 'already enabled label'
      } } }
    }).init()

    it('replies with the enable chat label and dispatches an enable chat action to the store if the chat is not yet enabled', () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      // A fresh store has no enabled chats
      const store = createStore(rootReducer)
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      enableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('enable chat label')
      expect(dispatchSpy).toHaveBeenCalledWith(enableChat('someId'))
    })

    it('replies with the already enabled label if the chat is already enabled', () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      const store = createStore(rootReducer)
      store.dispatch(enableChat('someId'))

      enableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('already enabled label')
    })
  })

  describe('disableCommand', () => {
    const i18n = i18next.createInstance({
      lng: 'en',
      resources: { en: { translation: {
        'disable chat': 'disable chat label',
        'already disabled': 'already disabled label'
      } } }
    }).init()

    it('replies with the disable chat label and dispatches a disable chat action to the store if the chat is enabled', () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      const store = createStore(rootReducer)
      store.dispatch(enableChat('someId'))
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      disableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('disable chat label')
      expect(dispatchSpy).toHaveBeenCalledWith(disableChat('someId'))
    })

    it('replies with the already disabled label if the chat is not enabled', () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      const store = createStore(rootReducer)

      disableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('already disabled label')
    })
  })

  describe('setLanguageCommand', () => {
    it('replies with language unknown if the given languages is neither de nor en', () => {
      const i18n = i18next.createInstance({
        lng: 'en',
        resources: { en: { translation: {
          'language unknown': 'language unknown label'
        } } }
      }).init()
      const store = createStore(rootReducer)
      const mockCtx = {
        update: { message: { text: '/setLanguage fr' } },
        reply: jest.fn()
      }
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('language unknown label')
    })

    it('replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is de', () => {
      const i18n = i18next.createInstance({
        lng: 'en',
        resources: {
          en: { translation: {
            'language changed': 'language changed label'
          } },
          de: { translation: {
            'language changed': 'sprache geändert label'
          } }
        }
      }).init()
      const store = createStore(rootReducer)
      const mockCtx = {
        update: { message: { text: '/setLanguage de' } },
        reply: jest.fn()
      }
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('sprache geändert label')
      expect(dispatchSpy).toHaveBeenCalledWith(setLanguage('de'))
      expect(i18n.language).toEqual('de')
    })

    it('replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is en', () => {
      const i18n = i18next.createInstance({
        lng: 'en',
        resources: {
          en: { translation: {
            'language changed': 'language changed label'
          } },
          de: { translation: {
            'language changed': 'sprache geändert label'
          } }
        }
      }).init()
      const store = createStore(rootReducer)
      const mockCtx = {
        update: { message: { text: '/setLanguage en' } },
        reply: jest.fn()
      }
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith('language changed label')
      expect(dispatchSpy).toHaveBeenCalledWith(setLanguage('en'))
      expect(i18n.language).toEqual('en')
    })
  })
})
