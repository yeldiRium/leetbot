const { flaschenpost } = require("flaschenpost");

const telegramUtility = require("./util/telegram");

const logger = flaschenpost.getLogger();

const groupAdminMiddleware = ({ bot }) => async (ctx, next) => {
  const chatId = telegramUtility.chatIdInContext(ctx);
  const fromId = telegramUtility.fromIdInContext(ctx);

  if (telegramUtility.isChatinContextAGroupChat(ctx)) {
    try {
      const chatAdmins = await bot.telegram.getChatAdministrators(chatId);
      ctx.fromIsGroupAdmin = chatAdmins.some(
        (admin) => admin.user.id == fromId
      );
    } catch (e) {
      logger.error(e);
      ctx.fromIsGroupAdmin = false;
    }
  } else {
    ctx.fromIsGroupAdmin = true;
  }

  next(ctx);
};

const onlyAdmin = (cmd) => (ctx, next) => {
  if (ctx.fromIsGroupAdmin) {
    cmd(ctx, next);
  }

  next(ctx);
};

module.exports = { groupAdminMiddleware, onlyAdmin };
