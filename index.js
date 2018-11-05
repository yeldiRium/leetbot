import config from './config'
import testbot from './testbot'

testbot(config.testbot.token, {
  username: config.testbot.username
})
