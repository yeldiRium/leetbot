import { loadConfig } from './config'
import leetbot from './leetbot'
import debugbot from './debugbot'

const config = loadConfig()

leetbot(config.leetbot.token, config.leetbot.config, {
  username: config.leetbot.username
})

debugbot(config.debugbot.token, config.debugbot.config, {
  username: config.debugbot.username
})
