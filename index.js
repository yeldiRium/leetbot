import { loadConfig } from './config'
import leetbot from './leetbot'

const config = loadConfig()

leetbot(config.leetbot.token, config.leetbot.config, {
  username: config.leetbot.username
})
