import { loadConfig } from './config'
import leetbot from './leetbot'
import debugbot from './debugbot'

import { validToken } from './util'

const config = loadConfig()

validToken(config.leetbot.token) && leetbot(
  config.leetbot.token,
  config.leetbot.config,
  {
    username: config.leetbot.username
  }
)

validToken(config.debugbot.token) && debugbot(
  config.debugbot.token,
  config.debugbot.config,
  {
    username: config.debugbot.username
  }
)
