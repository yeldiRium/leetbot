import * as R from 'ramda'

import { parseHours, parseMinutes } from './time'

const loadConfig = () => {
  const timezone = R.defaultTo('Europe/Berlin', process.env.TIMEZONE)
  console.log(`timezone: ${timezone}`)

  return {
    sentry: {
      privateDSN: R.defaultTo('', process.env.SENTRY_DSN)
    },
    examplebot: {
      token: R.defaultTo('', process.env.EXAMPLEBOT_TOKEN),
      username: R.defaultTo('', process.env.EXAMPLEBOT_USERNAME),
      config: {}
    },
    leetbot: {
      token: R.defaultTo('', process.env.LEETBOT_TOKEN),
      username: R.defaultTo('', process.env.LEETBOT_USERNAME),
      config: {
        commit: R.defaultTo('', process.env.COMMIT),
        leetHours: parseHours(R.defaultTo(13, process.env.LEETBOT_HOURS), timezone),
        leetMinutes: parseMinutes(R.defaultTo(37, process.env.LEETBOT_MINUTES), timezone),
        dumpFile: String(R.defaultTo('./leetbot/dump.json', process.env.LEETBOT_DUMP_FILE)),
        dumpCron: R.defaultTo('* * * * *', process.env.LEETBOT_DUMP_CRON),
        timezone,
        admin: process.env.LEETBOT_ADMIN
      }
    }
  }
}

export {
  loadConfig
}
