const userName = from =>
  from.username || from.first_name || from.last_name || from.id

const chatName = chat =>
  chat.title || chat.username || chat.first_name || chat.last_name || chat.id

const messageText = ctx => {
  if (ctx.message) {
    if (ctx.message.text) {
      return ctx.message.text
    }
    return '<media>'
  }
  if (ctx.editedMessage) {
    return ctx.editedMessage.text
  }
  return '<unknown>'
}

const logger = (ctx, next) => {
  console.log(
    `[${ctx.updateType}] ${userName(ctx.from)}: '${messageText(ctx)}' with '${chatName(ctx.chat)}'`
  )
  next()
}

export default logger
