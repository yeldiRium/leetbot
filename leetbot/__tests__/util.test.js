import {
  isTimeForReminder,
  isCurrentlyLeet,
  userInContext,
  isLeetLegit,
  leftPad
} from '../util'

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

    it('should be true, if it is one minute before leet', () => {
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

    it('should be false, if it is not one minute before leet', () => {
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

    it('should be true, if it is currently leet', () => {
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

    it('should be false, if it is not currently leet', () => {
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

  describe('userInContext', () => {
    it('should get the responsible user from a telegraf context', () => {
      const mockUser = {
        some: 'data',
        doesnt: 'matter'
      }
      const mockContext = {
        update: {
          message: {
            from: mockUser
          }
        }
      }

      expect(userInContext(mockContext)).toEqual(mockUser)
    })

    it('should be undefined on a malformed context', () => {
      const mockContext = {
        lel: 'this',
        context: 'is broken'
      }

      expect(userInContext(mockContext)).toBeUndefined()
    })
  })

  describe('isLeetLegit', () => {
    it('should be true if the user is not yet leet and the message is exactly "1337"', () => {
      expect(isLeetLegit([], '1337', 'newUser')).toBe(true)
    })
    it('should be false if the user is already leet', () => {
      expect(isLeetLegit(['leetUser'], '1337', 'leetUser')).toBe(false)
    })
    it('should be false if the message is not exactly 1337', () => {
      const wrongLeets = [
        ' 1337',
        '137',
        '13 37',
        '13:37',
        'etc',
        'you get the gist'
      ]

      wrongLeets.forEach(
        wrongLeet => expect(isLeetLegit([], wrongLeet, 'user')).toBe(false)
      )
    })
  })

  describe('leftPad', () => {
    it('should dispatch to the builtin String.padStart method after converting the input to String', () => {
      const testCases = [
        ['someString', 12, '0', '00someString'],
        [13, 5, ' ', '   13'],
        [12345, 2, 'a', '12345'],
        ['ab', 6, 'ab', 'ababab']
      ]
      testCases.forEach(
        testCase => {
          const [inputString, length, padChar, expected] = testCase
          expect(leftPad(inputString)(length, padChar)).toEqual(expected)
        }
      )
    })
  })
})
