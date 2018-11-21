import { loadConfig } from './config'
import leetbot from './leetbot'

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
