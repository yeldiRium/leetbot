import { createStore } from 'redux'

import i18n from '../i18n'
import rootReducer from '../reducer'
import { startCommand, enableCommand, disableCommand, setLanguageCommand } from '../commands'
import { enableChat, disableChat, setLanguage, LANGUAGES } from '../actions'
import { languageInChat } from '../getters'

describe('commands', () => {
  describe('startCommand', () => {
    it('replies with the start label from i18n', async () => {
      const store = createStore(rootReducer)
      const mockCtx = {
        reply: jest.fn()
      }

      startCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('start'))
    })
  })

  describe('enableCommand', () => {
    it('replies with the enable chat label and dispatches an enable chat action to the store if the chat is not yet enabled', () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      // A fresh store has no enabled chats
      const store = createStore(rootReducer)
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      enableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('enable chat'))
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

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('already enabled'))
    })
  })

  describe('disableCommand', () => {
    it('replies with the disable chat label and dispatches a disable chat action to the store if the chat is enabled', async () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      const store = createStore(rootReducer)
      store.dispatch(enableChat('someId'))
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      disableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('disable chat'))
      expect(dispatchSpy).toHaveBeenCalledWith(disableChat('someId'))
    })

    it('replies with the already disabled label if the chat is not enabled', async () => {
      const mockCtx = {
        chat: { id: 'someId' },
        reply: jest.fn()
      }
      const store = createStore(rootReducer)

      disableCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('already disabled'))
    })
  })

  describe('setLanguageCommand', () => {
    it('replies with infotext is no language was given', async () => {
      const store = createStore(rootReducer)
      const chatId = 'someChatId'
      const mockCtx = {
        chat: { id: chatId },
        update: { message: { text: '/setLanguage' } },
        reply: jest.fn()
      }
      store.dispatch(enableChat(chatId))
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('command.setLanguage.no language given'))
    })

    it('replies with language unknown if the given languages is neither de nor en', async () => {
      const store = createStore(rootReducer)
      const chatId = 'someChatId'
      const mockCtx = {
        chat: { id: chatId },
        update: { message: { text: '/setLanguage fr' } },
        reply: jest.fn()
      }
      store.dispatch(enableChat(chatId))
      store.dispatch(setLanguage(LANGUAGES.en, chatId))
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('language.unknown', { language: 'fr', lng: 'en' }))
    })

    it('replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is de', async () => {
      const store = createStore(rootReducer)
      const chatId = 'someChatId'
      const mockCtx = {
        chat: { id: chatId },
        update: { message: { text: '/setLanguage de' } },
        reply: jest.fn()
      }
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      store.dispatch(enableChat(chatId))
      store.dispatch(setLanguage(LANGUAGES.en, chatId))
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('language.changed'))
      expect(dispatchSpy).toHaveBeenCalledWith(setLanguage('de', chatId))
      expect(languageInChat(chatId, store)).toEqual('de')
    })

    it('replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is en', async () => {
      const store = createStore(rootReducer)
      const chatId = 'someChatId'
      const mockCtx = {
        chat: { id: chatId },
        update: { message: { text: '/setLanguage en' } },
        reply: jest.fn()
      }
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      store.dispatch(enableChat(chatId))
      store.dispatch(setLanguage(LANGUAGES.en, chatId))
      setLanguageCommand({ i18n, store })(mockCtx)

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t('language.changed', { lng: 'en' }))
      expect(dispatchSpy).toHaveBeenCalledWith(setLanguage('en', chatId))
    })
  })
})
