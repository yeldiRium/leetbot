import { loadConfig } from '../config'

describe('loadConfig', () => {
  beforeEach(() => {
    delete process.env.COMMIT
    delete process.env.SENTRY_DSN
    delete process.env.TIMEZONE
    delete process.env.LEETBOT_TOKEN
    delete process.env.LEETBOT_USERNAME
    delete process.env.LEETBOT_HOURS
    delete process.env.LEETBOT_MINUTES
    delete process.env.LEETBOT_DUMP_FILE
    delete process.env.LEETBOT_DUMP_CRON
    delete process.env.LEETBOT_ADMIN
    delete process.env.EXAMPLEBOT_TOKEN
    delete process.env.EXAMPLEBOT_USERNAME
  })

  it('should read environment variables correctly calculate hours/minutes according to timezone', () => {
    process.env.COMMIT = 'xnqvflegv'
    process.env.SENTRY_DSN = 'thisIsObviouslyAValidDSN'
    process.env.TIMEZONE = 'Europe/Moscow' // UTC+3
    process.env.LEETBOT_TOKEN = 'leetbotToken'
    process.env.LEETBOT_USERNAME = 'fxqelainxq'
    process.env.LEETBOT_HOURS = '10' // => 7
    process.env.LEETBOT_MINUTES = '12'
    process.env.LEETBOT_DUMP_FILE = 'sooomewhere'
    process.env.LEETBOT_DUMP_CRON = 'somecron'
    process.env.LEETBOT_ADMIN = 'omgWas1Admin'
    process.env.EXAMPLEBOT_TOKEN = 'examplebotToken'
    process.env.EXAMPLEBOT_USERNAME = 'EXamPlEboT usErNAme'

    const config = loadConfig()

    expect(config.sentry.privateDSN).toBe(process.env.SENTRY_DSN)
    expect(config.examplebot.token).toBe(process.env.EXAMPLEBOT_TOKEN)
    expect(config.examplebot.username).toBe(process.env.EXAMPLEBOT_USERNAME)
    expect(config.examplebot.config).toEqual({})
    expect(config.leetbot.token).toBe(process.env.LEETBOT_TOKEN)
    expect(config.leetbot.username).toBe(process.env.LEETBOT_USERNAME)
    expect(config.leetbot.config.commit).toBe(process.env.COMMIT)
    expect(config.leetbot.config.leetHours).toBe(7)
    expect(config.leetbot.config.leetMinutes).toBe(Number(process.env.LEETBOT_MINUTES))
    expect(config.leetbot.config.dumpFile).toBe(process.env.LEETBOT_DUMP_FILE)
    expect(config.leetbot.config.dumpCron).toBe(process.env.LEETBOT_DUMP_CRON)
    expect(config.leetbot.config.timezone).toBe(process.env.TIMEZONE)
    expect(config.leetbot.config.admin).toBe(process.env.LEETBOT_ADMIN)
  })

  it('should set sensible default values', () => {
    const config = loadConfig()

    expect(config.examplebot.token).toBe('')
    expect(config.examplebot.username).toBe('')
    expect(config.examplebot.config).toEqual({})
    expect(config.leetbot.token).toBe('')
    expect(config.leetbot.username).toBe('')
    expect(config.leetbot.config.commit).toBe('')
    expect(config.leetbot.config.leetHours).toBe(12) // UTC+1 by default
    expect(config.leetbot.config.leetMinutes).toBe(37)
    expect(config.leetbot.config.dumpFile).toBe('./leetbot/dump.json')
    expect(config.leetbot.config.dumpCron).toBe('* * * * *')
    expect(config.leetbot.config.timezone).toBe('Europe/Berlin')
    expect(config.leetbot.config.admin).toBe(undefined)
  })
})
