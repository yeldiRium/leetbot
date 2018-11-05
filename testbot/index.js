import Telegraf from 'telegraf'

const bot = token => {
  const bot = new Telegraf(token)

  bot.command('start', ({ reply }) => {
    reply('Welcome to yeldiR\'s test bot! There is nothing here yet!')
  })

  bot.startPolling()

  return bot
}

export default bot
