import { loadConfig } from './config'
import { validToken } from './util'

import leetbot from './leetbot'

const config = loadConfig()

const registeredBots = [
  {
    name: 'leetbot',
    bot: leetbot
  }
  // Uncomment this and import the examplebot to see it in action.
  // {
  //  name: 'examplebot',
  //  bot: examplebot
  // }
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
