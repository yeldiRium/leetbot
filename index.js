import { loadConfig } from './config'
import leetbot from './leetbot'

import { validToken } from './util'

const config = loadConfig()

const registeredBots = [
  {
    name: 'leetbot',
    bot: leetbot
  }
]

for (const bot of registeredBots) {
  const botConfig = config[bot.name]
  if (validToken(botConfig.token)) {
    console.log(`Valid token found for ${bot.name}. Starting...`)
    bot.bot(
      botConfig.token,
      botConfig.config,
      {
        username: botConfig.username
      }
    )
  } else {
    console.error(`No valid token provided for ${bot.name}. It will not start!`)
  }
}
