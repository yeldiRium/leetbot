import { isTimeForReminder, isCurrentlyLeet } from '../util'

const mockLeetbotConfig = config => ({
  loadConfig: () => ({
    leetbot: config
  })
})

describe('util', () => {
  const RealDate = Date

  const mockDate = (isoDate) => {
    global.Date = class extends RealDate {
      constructor () {
        return new RealDate(isoDate)
      }
    }
  }

  const resetDate = () => {
    global.Date = RealDate
  }

  describe('isTimeForReminder', () => {
    afterEach(resetDate)

    it('should return true, if it is one minute before leet', () => {
      mockLeetbotConfig({
        config: {
          leetHours: 13,
          leetMinutes: 37
        }
      })

      const testTime = new Date()
      // fucking timezones
      testTime.setHours(12, 36)
      mockDate(testTime.toISOString())

      expect(isTimeForReminder()).toBe(true)
    })

    it('should return false, if it is not one minute before leet', () => {
      mockLeetbotConfig({
        config: {
          leetHours: 13,
          leetMinutes: 37
        }
      })

      const testTime = new Date()
      // fucking timezones
      testTime.setHours(14, 12)
      mockDate(testTime.toISOString())

      expect(isTimeForReminder()).toBe(false)
    })
  })

  describe('isCurrentlyLeet', () => {
    afterEach(resetDate)

    it('should return true, if it is currently leet', () => {
      mockLeetbotConfig({
        config: {
          leetHours: 13,
          leetMinutes: 37
        }
      })

      const testTime = new Date()
      // fucking timezones
      testTime.setHours(12, 37)
      mockDate(testTime.toISOString())

      expect(isCurrentlyLeet()).toBe(true)
    })

    it('should return false, if it is not currently leet', () => {
      mockLeetbotConfig({
        config: {
          leetHours: 13,
          leetMinutes: 37
        }
      })

      const testTime = new Date()
      // fucking timezones
      testTime.setHours(14, 12)
      mockDate(testTime.toISOString())

      expect(isCurrentlyLeet()).toBe(false)
    })
  })
})
