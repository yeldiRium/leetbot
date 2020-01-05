const actions = require("../store/actions");
const getters = require("../store/getters");
const telegramUtility = require("../util/telegram");

/**
 * Enables the chat the command is sent from for future leeting.
 */
const enable = ({ store }) => ctx => {
  const chatId = telegramUtility.chatIdInContext(ctx);

  if (!getters.isChatEnabled(chatId)(store.getState())) {
    store.dispatch(actions.enableChat(chatId));
    ctx.reply(ctx.t("command.enable.enabled"));
  } else {
    ctx.reply(ctx.t("command.enable.already enabled"));
  }
};

module.exports = enable;
