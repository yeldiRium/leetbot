import { loadConfig } from './config'
import leetbot from './leetbot'

import { validToken } from './util'

const config = loadConfig()

if (validToken(config.leetbot.token)) {
  leetbot(
    config.leetbot.token,
    config.leetbot.config,
    {
      username: config.leetbot.username
    }
  )
} else {
  console.error('No valid token provided! Aborting.')
}
