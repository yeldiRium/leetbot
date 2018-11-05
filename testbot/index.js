import Telegraf from 'telegraf'

const bot = token => {
    const bot = new Telegraf(token)

    bot.command('start', ({ reply }) => {
        reply('Hi du bob!')
    })

    bot.startPolling()

    return bot
}

export default bot
