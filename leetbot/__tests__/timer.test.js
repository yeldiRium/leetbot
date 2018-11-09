import moment from 'moment-timezone'

describe('moment', () => {
  it('can compare times of different timezones accurately', () => {
    const earlier = moment.tz('2018-02-15T15:00', 'Asia/Srednekolymsk') // UTC+11 & no DST
    const later = moment.tz('2018-02-15T15:00', 'Africa/Asmara') // UTC+3 & no DST

    expect(earlier.isBefore(later)).toBe(true)
  })
})
