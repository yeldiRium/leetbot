const Extra = require("telegraf/extra");

const actions = require("../store/actions");
const getters = require("../store/getters");
const { isCurrentlyLeet } = require("../leet");
const { sample } = require("../util/random");
const telegramUtility = require("../util/telegram");

/**
 * Watches incoming messages during the leet period.
 * Updates the store and tells assholes off if necessary.
 */
const watchLeet = ({ store, config: { leetHour, leetMinute, timezone } }) => (
  ctx
) => {
  if (ctx.updateType !== "message") {
    return;
  }

  const chatId = telegramUtility.chatIdInContext(ctx);

  if (!getters.isChatEnabled(chatId)(store.getState())) {
    return;
  }

  const message = telegramUtility.messageInContext(ctx) || "";

  if (isCurrentlyLeet(leetHour, leetMinute, timezone)) {
    if (getters.isLeetInChatAborted(chatId)(store.getState())) {
      return;
    }
    const user = telegramUtility.legibleUserInContext(ctx);
    if (
      !/^1337$/.test(message) ||
      getters.isPersonInChatAlreadyLeet(user, chatId)(store.getState())
    ) {
      store.dispatch(actions.abortLeet(user, chatId));

      const insultOptions = ctx.t("callout.asshole", {
        asshole: user,
        returnObjects: true,
      });
      return ctx.reply(
        sample(insultOptions),
        Extra.inReplyTo(telegramUtility.messageIdInContext(ctx))
      );
    }
    return store.dispatch(actions.addLeetPerson(user, chatId));
  }

  if (/^1337$/.test(message)) {
    const insultOptions = ctx.t("callout.timing", {
      returnObjects: true,
    });

    return ctx.reply(
      sample(insultOptions),
      Extra.inReplyTo(telegramUtility.messageIdInContext(ctx))
    );
  }
};

module.exports = watchLeet;
