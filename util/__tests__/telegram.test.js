import { messageInContext } from '../telegram'

describe('telegram util', () => {
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
})
