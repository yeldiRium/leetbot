import {
  messageInContext,
  chatIdInContext,
  messageIdInContext,
  legibleUserInContext,
  subCommandInContext,
  crashHandler
} from '../telegram'

describe('telegram util', () => {
  describe('chatIdInContext', () => {
    it('should get the chatId from a telegraf context', () => {
      const mockChatId = 'someId'
      const mockContext = {
        chat: {
          id: mockChatId
        }
      }

      expect(chatIdInContext(mockContext)).toEqual(mockChatId)
    })

    it('should be undefined on a malformed context', () => {
      const mockContext = {
        lel: 'this',
        context: 'is broken'
      }

      expect(chatIdInContext(mockContext)).toBeUndefined()
    })
  })

  describe('messageIdInContext', () => {
    it('should get the messageId from a telegraf context', () => {
      const mockMessageId = 'someId'
      const mockContext = {
        update: {
          message: {
            'message_id': mockMessageId
          }
        }
      }

      expect(messageIdInContext(mockContext)).toEqual(mockMessageId)
    })

    it('should be undefined on a malformed context', () => {
      const mockContext = {
        lel: 'this',
        context: 'is broken'
      }

      expect(messageIdInContext(mockContext)).toBeUndefined()
    })
  })

  describe('legibleUserInContext', () => {
    it('should prefer the username', () => {
      const mockContext = {
        from: {
          username: 'username',
          'first_name': 'first_name',
          'last_name': 'last_name',
          id: 'id'
        }
      }

      expect(legibleUserInContext(mockContext)).toEqual('username')
    })

    it('should take the first name second', () => {
      const mockContext = {
        from: {
          'first_name': 'first_name',
          'last_name': 'last_name',
          id: 'id'
        }
      }

      expect(legibleUserInContext(mockContext)).toEqual('first_name')
    })

    it('should take the last name third', () => {
      const mockContext = {
        from: {
          'last_name': 'last_name',
          id: 'id'
        }
      }

      expect(legibleUserInContext(mockContext)).toEqual('last_name')
    })

    it('should take the id last', () => {
      const mockContext = {
        from: {
          id: 'id'
        }
      }

      expect(legibleUserInContext(mockContext)).toEqual('id')
    })
  })

  describe('messageInContext', () => {
    it('should get the message text from a telegraf context', () => {
      const mockText = 'this is the message text that should be returned'
      const mockContext = {
        update: {
          message: {
            text: mockText
          }
        }
      }

      expect(messageInContext(mockContext)).toEqual(mockText)
    })

    it('should be undefined on a malformed context', () => {
      const mockContext = {

        lel: 'this',
        context: 'is broken'
      }

      expect(messageInContext(mockContext)).toBeUndefined()
    })
  })

  describe('subcommandInContext', () => {
    const makeDummyContextWithMessage = message => ({
      update: { message: { text: message } }
    })
    it('should be a function', () => {
      expect(typeof subCommandInContext).toBe('function')
    })
    it('should be undefined if the context does not contain a command', () => {
      expect(
        subCommandInContext(makeDummyContextWithMessage('blub'))
      ).toBeUndefined()
    })
    it('should return the message text without the top-level command', () => {
      expect(
        subCommandInContext(makeDummyContextWithMessage('/blub blab'))
      ).toBe('blab')
      expect(
        subCommandInContext(makeDummyContextWithMessage('/blub@SomeBot test'))
      ).toBe('test')
    })
  })

  describe('crashHandler', () => {
    it('resolves to the same value the callback resolves to', () => {
      const callback = () => new Promise((resolve, reject) => {
        resolve('success')
      })
      expect(crashHandler('irrelevant', callback))
        .resolves.toEqual('success')
    })

    it('resolves to undefined and logs, if the callback rejects', async () => {
      console.log = jest.fn()
      const callback = () => new Promise((resolve, reject) => {
        reject(new Error('fail'))
      })
      await (expect(crashHandler('irrelevant', callback))
        .resolves.toBeUndefined())
      expect(console.log).toHaveBeenCalled()
    })
  })
})
