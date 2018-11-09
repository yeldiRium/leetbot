import * as R from 'ramda'

import { chatIdInContext, messageInContext } from '../util/telegram'
import { formatHours, formatMinutes } from '../util/time'
import { isChatActive } from './getters'
import { enableChat, disableChat, setLanguage } from './actions'

export const startCommand = ({ i18n }) => ctx => {
  ctx.reply(i18n.t('start'))
}

export const enableCommand = ({ store, i18n }) => ctx => {
  if (!isChatActive(chatIdInContext(ctx), store)) {
    store.dispatch(enableChat(chatIdInContext(ctx)))
    ctx.reply(i18n.t('enable chat'))
  } else {
    ctx.reply(i18n.t('already enabled'))
  }
}

export const disableCommand = ({ store, i18n }) => ctx => {
  if (isChatActive(chatIdInContext(ctx), store)) {
    store.dispatch(disableChat(chatIdInContext(ctx)))
    ctx.reply(i18n.t('disable chat'))
  } else {
    ctx.reply(i18n.t('already disabled'))
  }
}

export const infoCommand = ({ store, config: { leetHours, leetMinutes, timezone }, i18n }) => ctx => {
  let info = i18n.t('current language', {
    language: i18n.languages
  }) + '\n'
  if (isChatActive(chatIdInContext(ctx), store)) {
    info += i18n.t('chat active')
  } else {
    info += i18n.t('chat inactive')
  }

  info += '\n' + i18n.t(
    'leet time',
    {
      hours: formatHours(leetHours, timezone),
      minutes: formatMinutes(leetMinutes, timezone),
      timezone
    }
  )

  ctx.reply(info)
}

export const setLanguageCommand = ({ store, i18n }) => ctx => {
  const newLanguage = messageInContext(ctx).split(' ').slice(-1)[0]

  if (R.contains(newLanguage, ['de', 'en'])) {
    i18n.changeLanguage(
      newLanguage,
      (err, t) => {
        if (err) {
          ctx.reply(i18n.t('error'))
        } else {
          ctx.reply(i18n.t('language changed'))
          store.dispatch(setLanguage(newLanguage))
        }
      }
    )
  } else {
    ctx.reply(i18n.t('language unknown', {
      language: newLanguage
    }))
  }
}
