const Extra = require("telegraf/extra");
const R = require("ramda");

const {
  abortLeet,
  addLeetPerson,
  enableChat,
  disableChat,
  restartLeet,
  setLanguage
} = require("./store/actions");
const {
  chatIdInContext,
  fromIdInContext,
  legibleUserInContext,
  messageIdInContext,
  messageInContext
} = require("./util/telegram");
const { getters } = require("./store/getters");
const { isCurrentlyLeet } = require("./leet");
const { sample } = require("./util");

const {
  isChatActive,
  isLeetInChatAborted,
  isPersonInChatAlreadyLeet,
  languageOrDefault,
  recordInChat,
  userScore
} = getters;

/*
 * Commands are leetbot-specific middleware factories that all take a number of
 * default arguments. You should always pass the store, i18n and the leetbot
 * config to them.
 */

/**
 * Replies with the start message.
 */
const startCommand = () => ctx => {
  ctx.reply(ctx.t("start"));
};

/**
 * Enables the chat the command is sent from for future leeting.
 */
const enableCommand = ({ store }) => ctx => {
  const chatId = chatIdInContext(ctx);

  if (!isChatActive(chatId, store)) {
    store.dispatch(enableChat(chatId));
    ctx.reply(ctx.t("enable chat"));
  } else {
    ctx.reply(ctx.t("already enabled"));
  }
};

/**
 * Disables the chat the command is sent from leeting.
 */
const disableCommand = ({ store }) => ctx => {
  const chatId = chatIdInContext(ctx);

  if (isChatActive(chatId, store)) {
    store.dispatch(disableChat(chatId));
    ctx.reply(ctx.t("disable chat"));
  } else {
    ctx.reply(ctx.t("already disabled"));
  }
};

/**
 * Prints some debug info about the bot and chat the command is sent from.
 */
const infoCommand = ({
  store,
  config: { leetHours, leetMinutes, timezone, version }
}) => ctx => {
  const chatId = chatIdInContext(ctx);
  const language = languageOrDefault(chatId, store);

  let info =
    ctx.t("info.currentLanguage", {
      language
    }) + "\n";

  if (isChatActive(chatId, store)) {
    info += ctx.t("info.chatActive");
    info +=
      "\n" +
      ctx.t("info.currentRecord", {
        record: recordInChat(chatId, store)
      });
  } else {
    info += ctx.t("info.chatInactive");
  }

  info +=
    "\n" +
    ctx.t("info.timezone", {
      timezone
    });

  info +=
    "\n" +
    ctx.t("info.version", {
      version
    });

  ctx.reply(info);
};

/**
 * Sets the language for the bot. This is cross-chat.
 */
const setLanguageCommand = ({ store }) => ctx => {
  const chatId = chatIdInContext(ctx);
  const newLanguage = messageInContext(ctx)
    .split(" ")
    .slice(-1)[0];

  if (newLanguage === "/setLanguage") {
    // no language was given
    ctx.reply(ctx.t("command.setLanguage.no language given"));
  } else if (R.contains(newLanguage, ["de", "en"])) {
    store.dispatch(setLanguage(newLanguage, chatId));

    ctx.reply(ctx.t("language.changed"));
  } else {
    ctx.reply(
      ctx.t("language.unknown", {
        language: newLanguage
      })
    );
  }
};

/**
 * Watches incoming messages during the leet period.
 * Updates the store and tells assholes off if necessary.
 */
const watchLeetCommand = ({
  store,
  config: { leetHours, leetMinutes }
}) => ctx => {
  const chatId = chatIdInContext(ctx);

  if (!isChatActive(chatId, store)) {
    return;
  }

  const message = messageInContext(ctx);

  if (isCurrentlyLeet(leetHours, leetMinutes)) {
    if (isLeetInChatAborted(chatId, store)) {
      return;
    }
    const user = legibleUserInContext(ctx);
    if (
      !R.test(/^1337$/, message) ||
      isPersonInChatAlreadyLeet(chatId, user, store)
    ) {
      store.dispatch(abortLeet(user, chatId));

      const insultOptions = ctx.t("callout.asshole", {
        asshole: user,
        returnObjects: true
      });
      return ctx.reply(
        sample(insultOptions),
        Extra.inReplyTo(messageIdInContext(ctx))
      );
    }
    return store.dispatch(addLeetPerson(user, chatId));
  }

  if (R.test(/^1337$/, message)) {
    const insultOptions = ctx.t("callout.timing", {
      returnObjects: true
    });

    return ctx.reply(
      sample(insultOptions),
      Extra.inReplyTo(messageIdInContext(ctx))
    );
  }
};

/**
 * Dumps the current store state into the chat.
 */
const debugCommand = ({ store }) => ctx => {
  ctx.reply(JSON.stringify(store.getState(), null, 2));
};

/**
 * Resets the state for the current chat.
 */
const resetCommand = ({ store }) => ctx => {
  const chatId = chatIdInContext(ctx);

  store.dispatch(restartLeet(chatId));
  ctx.reply(ctx.t("debug.stateReset"));
};

const getUserScoreCommand = ({ store }) => ctx => {
  const chatId = chatIdInContext(ctx);
  const fromId = fromIdInContext(ctx);

  if (chatId !== fromId && !isChatActive(chatId, store)) {
    return;
  }

  // If the user posts the message in a chat, flame them, then message them
  // privately
  if (chatId !== fromId) {
    ctx.reply(
      ctx.t("command.score.group"),
      Extra.inReplyTo(messageIdInContext(ctx))
    );
  }

  ctx.telegram.sendMessage(
    fromId,
    ctx.t("command.score.private", { score: userScore(fromId, store) })
  );
};

module.exports = {
  enableCommand,
  debugCommand,
  disableCommand,
  getUserScoreCommand,
  infoCommand,
  resetCommand,
  setLanguageCommand,
  startCommand,
  watchLeetCommand
};
