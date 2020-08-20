const telegramUtility = require("./util/telegram");

const groupAdminMiddleware = ({ bot }) => async (ctx, next) => {
  const chatId = telegramUtility.chatIdInContext(ctx);
  const fromId = telegramUtility.fromIdInContext(ctx);

  if (telegramUtility.chatInContextIsGroupChat(ctx)) {
    const chatAdmins = await bot.telegram.getChatAdministrators(chatId);
    ctx.fromIsGroupAdmin = chatAdmins.some((admin) => admin.user.id == fromId);
  } else {
    ctx.fromIsGroupAdmin = true;
  }
  next(ctx);
};

const groupAdminCommandTransformer = (cmd) => (ctx, next) => {
  if (ctx.fromIsGroupAdmin) {
    cmd(ctx, next);
  }
};

module.exports = { groupAdminMiddleware, groupAdminCommandTransformer };
