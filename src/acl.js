const telegramUtility = require("./util/telegram");

const groupAdminMiddleware = ({ bot }) => async (ctx, next) => {
  const chatId = telegramUtility.chatIdInContext(ctx);
  const fromId = telegramUtility.fromIdInContext(ctx);

  if (telegramUtility.chatIdInContext > 0) {
    ctx.fromIsGroupAdmin = true;
  } else {
    const chatAdmins = await bot.telegram.getChatAdministrators(chatId);
    ctx.fromIsGroupAdmin = chatAdmins.some((admin) => admin.user.id == fromId);
  }
  next(ctx);
};

const groupAdminCommandTransformer = (cmd) => (ctx, next) => {
  if (ctx.fromIsGroupAdmin) {
    cmd(ctx, next);
  }
};

module.exports = { groupAdminMiddleware, groupAdminCommandTransformer };
