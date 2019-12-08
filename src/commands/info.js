const { getters } = require("../store/getters");
const telegramUtility = require("../util/telegram");

/**
 * Prints some debug info about the bot and chat the command is sent from.
 */
const info = ({
  store,
  config: { leetHour, leetMinute, timezone, version }
}) => ctx => {
  const chatId = telegramUtility.chatIdInContext(ctx);
  const language = getters.languageOrDefault(chatId, store);

  let info =
    ctx.t("info.currentLanguage", {
      language
    }) + "\n";

  if (getters.isChatActive(chatId, store)) {
    info += ctx.t("info.chatActive");
    info +=
      "\n" +
      ctx.t("info.currentRecord", {
        record: getters.recordInChat(chatId, store)
      });
  } else {
    info += ctx.t("info.chatInactive");
  }

  info +=
    "\n" +
    ctx.t("info.leetTime", {
      leetHour,
      leetMinute,
      timezone
    });

  info +=
    "\n" +
    ctx.t("info.version", {
      version
    });

  ctx.reply(info);
};

module.exports = info;
