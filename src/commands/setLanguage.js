const actions = require("../store/actions");
const telegramUtility = require("../util/telegram");

/**
 * Sets the language for the bot. This is cross-chat.
 */
const setLanguage = ({ store }) => (ctx) => {
  const chatId = telegramUtility.chatIdInContext(ctx);
  const newLanguage = telegramUtility
    .messageInContext(ctx)
    .split(" ")
    .slice(-1)[0];

  if (newLanguage === "/setLanguage") {
    // no language was given
    ctx.reply(ctx.t("command.setLanguage.no language given"));
  } else if (["de", "en"].includes(newLanguage)) {
    store.dispatch(actions.setLanguage(newLanguage, chatId));

    ctx.reply(ctx.t("language.changed"));
  } else {
    ctx.reply(
      ctx.t("language.unknown", {
        language: newLanguage,
      })
    );
  }
};

module.exports = setLanguage;
