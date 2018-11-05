import * as R from 'ramda'

const loadConfig = () => ({
  leetbot: {
    token: R.defaultTo('', process.env.LEETBOT_TOKEN),
    username: R.defaultTo('', process.env.LEETBOT_USERNAME),
    config: {
      chatId: R.defaultTo('', process.env.LEETBOT_CHAT_ID),
      leetHours: (Number(R.defaultTo(13, process.env.LEETBOT_HOURS)) + 23) % 24, // Fucking timezones.
      leetMinutes: Number(R.defaultTo(37, process.env.LEETBOT_MINUTES))
    }
  }
})

export {
  loadConfig
}
