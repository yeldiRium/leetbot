import i18n from '../../i18n'

import helpCommand, { subCommands } from '../help'

describe('helpCommand', () => {
  const help = helpCommand({ i18n })
  const makeDummyContextWithMessage = message => ({
    update: { message: { text: message } },
    reply: jest.fn()
  })

  it('is a function', () => {
    expect(typeof helpCommand).toBe('function')
  })

  it('accepts options and returns a function', () => {
    expect(typeof help).toBe('function')
  })

  it('responds with the generic help if no subcommand is given', () => {
    const ctx = makeDummyContextWithMessage('/help')
    help(ctx)
    expect(ctx.reply).toBeCalledWith(i18n.t('help'))
  })

  it('responds with the unknown command message if an unknown subcommand is given', () => {
    const command = '8ne194lgu'
    const ctx = makeDummyContextWithMessage(`/help ${command}`)
    help(ctx)
    expect(ctx.reply).toBeCalledWith(i18n.t('command unknown', { command }))
  })

  describe('list', () => {
    it('responds with a list of commands when /help list is called', () => {
      const ctx = makeDummyContextWithMessage('/help list')
      const expectedAnswer = i18n.t('available commands') + ':\n' +
          Object.keys(subCommands).map(key => {
            return `/help ${key}`
          }).join('\n')
      help(ctx)
      expect(ctx.reply).toBeCalledWith(expectedAnswer)
    })
  })

  describe('language', () => {
    it('responds with a list of available languages and commands when /help language is called', () => {
      const ctx = makeDummyContextWithMessage('/help language')
      const languages = Object.keys(i18n.options.resources)
      const expectedAnswer = i18n.t('language.available') + ':\n' +
        languages.map(languageShort =>
          `${i18n.t(`language.list.${languageShort}`)} - /setLanguage ${languageShort}`
        ).join('\n')
      help(ctx)
      expect(ctx.reply).toBeCalledWith(expectedAnswer)
    })
  })
})
