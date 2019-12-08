/**
 * Replies with the start message.
 */
const start = () => ctx => {
  ctx.reply(ctx.t("command.start"));
};

module.exports = start;
