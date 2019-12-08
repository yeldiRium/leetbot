const Extra = require("telegraf/extra");

const { getters } = require("../store/getters");
const telegramUtility = require("../util/telegram");

const getUserScore = ({ store }) => ctx => {
  const chatId = telegramUtility.chatIdInContext(ctx);
  const fromId = telegramUtility.fromIdInContext(ctx);

  if (chatId !== fromId && !getters.isChatActive(chatId, store)) {
    return;
  }

  // If the user posts the message in a chat, flame them, then message them
  // privately
  if (chatId !== fromId) {
    ctx.reply(
      ctx.t("command.score.group"),
      Extra.inReplyTo(telegramUtility.messageIdInContext(ctx))
    );
  }

  ctx.telegram.sendMessage(
    fromId,
    ctx.t("command.score.private", { score: getters.userScore(fromId, store) })
  );
};

module.exports = getUserScore;
