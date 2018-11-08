import * as R from 'ramda'

import { parseHours, parseMinutes } from './util/time'

const timezone = R.defaultTo('Europe/Berlin', process.env.TIMEZONE)
console.log(`timezone: ${timezone}`)

const loadConfig = () => ({
  leetbot: {
    token: R.defaultTo('', process.env.LEETBOT_TOKEN),
    username: R.defaultTo('', process.env.LEETBOT_USERNAME),
    config: {
      chatId: R.defaultTo('', process.env.LEETBOT_CHAT_ID),
      leetHours: parseHours(R.defaultTo(13, process.env.LEETBOT_HOURS), timezone),
      leetMinutes: parseMinutes(R.defaultTo(37, process.env.LEETBOT_MINUTES), timezone),
      dumpFile: String(R.defaultTo('./leetbot/dump.json', process.env.LEETBOT_DUMP_FILE)),
      dumpInterval: Number(R.defaultTo(300000), process.env.LEETBOT_DUMP_INTERVAL),
      timezone
    }
  },
  debugbot: {
    token: R.defaultTo('', process.env.DEBUGBOT_TOKEN),
    username: R.defaultTo('', process.env.DEBUGBOT_USERNAME),
    config: {}
  }
})

export {
  loadConfig
}
