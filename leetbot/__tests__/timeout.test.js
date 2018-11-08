import { informOrUpdateTimeout } from '../timeout'

describe('timeout functions', () => {
  describe('informOrUpdateTimeout', () => {
    it('should send an information message, if it is not currently leet', () => {
      jest.mock('../util', () => ({
        isCurrentlyLeet () {
          return false
        }
      }))

      const ctx = {
        reply: jest.fn()
      }
      const counterState = {
        leetPeople: [
          {
            username: 'blubbel',
            first_name: 'ayyy',
            id: '1234'
          },
          {
            first_name: 'ayyy',
            id: '1234'
          },
          {
            id: '1234'
          }
        ]
      }

      informOrUpdateTimeout(ctx, counterState)

      expect(ctx.reply.mock.calls.length).toBe(1)
      expect(ctx.reply.mock.calls[0][0]).toBe(`Today we reached 3 posts! Participants were: blubbel, ayyy, 1234`)
    })
  })
})
