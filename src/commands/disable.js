const actions = require("../store/actions");
const { getters } = require("../store/getters");
const telegramUtility = require("../util/telegram");

/**
 * Disables the chat the command is sent from leeting.
 */
const disable = ({ store }) => ctx => {
  const chatId = telegramUtility.chatIdInContext(ctx);

  if (getters.isChatActive(chatId, store)) {
    store.dispatch(actions.disableChat(chatId));
    ctx.reply(ctx.t("command.disable.disabled"));
  } else {
    ctx.reply(ctx.t("command.disable.already disabled"));
  }
};

module.exports = disable;
