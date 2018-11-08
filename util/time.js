import moment from 'moment-timezone'

export const parseHours = (hours, timezone) => moment()
  .tz(timezone).hour(hours).utc().hour()

export const parseMinutes = (minutes, timezone) => moment()
  .tz(timezone).minute(minutes).utc().minute()

export const formatHours = (hours, timezone) => moment()
  .utc().hour(hours).tz(timezone).hour()

export const formatMinutes = (minutes, timezone) => moment()
  .utc().minute(minutes).tz(timezone).minute()
