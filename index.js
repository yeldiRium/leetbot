import config from './config'
import leetbot from './leetbot'

leetbot(config.leetbot.token, {
  username: config.leetbot.username
})
