import { loadConfig } from './config'
import leetbot from './leetbot'
import debugbot from './debugbot'

import { validToken } from './util'

const config = loadConfig()

const bots = []

if (validToken(config.leetbot.token)) {
  bots.push(leetbot(
    config.leetbot.token,
    config.leetbot.config,
    {
      username: config.leetbot.username
    }
  ))
}

if (validToken(config.debugbot.token)) {
  bots.push(debugbot(
    config.debugbot.token,
    config.debugbot.config,
    {
      username: config.debugbot.username
    }
  ))
}

process.on('SIGTERM', function () {
  bots.forEach(bot => bot.shutdown())
})
