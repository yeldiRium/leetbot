import { createStore } from 'redux'

import { reminder } from '../leet'
import reducer from '../store/reducer'
import { enableChat } from '../store/actions'
import i18n from '../i18n'

describe('reminder', () => {
  const chatId = 'someChatIdIGuess'
  const messageId = 'someMessageId'
  const previousMessageId = 'someOlderMessageId'

  it('sends a message to each chat and pins it, returns the chatIds with their corresponding previouslyPinnedMessageIds', async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({ message_id: messageId }),
        pinChatMessage: jest.fn(),
        getChat: (aChatId) => {
          return {
            [chatId]: {
              'pinned_message': {
                'message_id': previousMessageId
              }
            }
          }[aChatId]
        }
      }
    }
    const store = createStore(reducer)
    store.dispatch(enableChat(chatId))

    const chats = await reminder(bot, store, i18n)

    expect(chats).toEqual([
      [chatId, previousMessageId]
    ])
    expect(bot.telegram.sendMessage).toHaveBeenCalled()
    expect(bot.telegram.pinChatMessage).toHaveBeenCalledWith(
      chatId, messageId
    )
  })

  it('return undefined for chats with no pinned message', async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({ message_id: messageId }),
        pinChatMessage: jest.fn(),
        getChat: (aChatId) => {
          return {
            [chatId]: {}
          }[aChatId]
        }
      }
    }
    const store = createStore(reducer)
    store.dispatch(enableChat(chatId))

    const chats = await reminder(bot, store, i18n)

    expect(chats).toEqual([
      [chatId, undefined]
    ])
  })
})
