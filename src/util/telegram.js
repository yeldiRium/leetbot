const { flaschenpost } = require("flaschenpost");
const R = require("ramda");

const getters = require("../store/getters");

const logger = flaschenpost.getLogger();

const chatIdInContext = R.path(["chat", "id"]);

const fromIdInContext = R.path(["from", "id"]);

const messageIdInContext = R.path(["update", "message", "message_id"]);

/**
 * Get the name of the user in the given context. Tries various ways to retrieve
 * the name to get something legible.
 */
const legibleUserInContext = (ctx) => {
  const from = ctx.from;
  return from.username || from.first_name || from.last_name || from.id;
};

/**
 * Retrieve the text message in the given context.
 */
const messageInContext = R.path(["update", "message", "text"]);

/**
 * Parse the context's message of the form
 *
 * /command subcommand some more stuff
 *
 * to retrieve the subcommand.
 */
const subCommandInContext = (ctx) => {
  const message = messageInContext(ctx);
  if (message[0] !== "/") {
    return undefined;
  }
  return message.split(" ").slice(1).join(" ");
};

/**
 * Catch and log any error that might occur further down the line.
 */
const crashHandler = (ctx, next) => {
  return next().catch((error) => logger.error("An error occured.", { error }));
};

/**
 * Retrieves the configured language for the chat in context (or uses the i18n
 * default language) and attaches a translation function to the context for easy
 * access in later middlewares.
 */
const translationMiddleware = ({ i18n, store }) => (ctx, next) => {
  const chatId = chatIdInContext(ctx);

  ctx.t = (key, params) => {
    const language = getters.getLanguageInChat(chatId)(store.getState());
    return i18n.t(key, { ...params, lng: language });
  };

  return next();
};

/**
 * Return whether or not the chat referenced in the context is a group chat.
 */
const chatInContextIsGroupChat = (ctx) => {
  return chatIdInContext(ctx) < 0;
};

module.exports = {
  chatIdInContext,
  fromIdInContext,
  messageIdInContext,
  legibleUserInContext,
  messageInContext,
  subCommandInContext,
  crashHandler,
  translationMiddleware,
  chatInContextIsGroupChat,
};
