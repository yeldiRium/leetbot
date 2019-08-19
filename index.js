import { loadConfig } from './util/config'
import { validToken } from './util'

import leetbot from './leetbot'

// This will be replaced by webpack.
const version = '<version_number>'

const config = loadConfig()

if (process.env.NODE_ENV === 'production') {
  console.log('Production environment detected.')
} else {
  console.log('Development environment detected.')
}
console.log(`Running version ${version}`)

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
      {
        ...botConfig.config,
        version
      },
      {
        username: botConfig.username
      }
    )
  } else {
    console.error(`No valid token provided for ${bot.name}. It will not start!`)
  }
}
