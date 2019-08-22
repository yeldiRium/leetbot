const R = require("ramda");

const { getters } = require("../leetbot/store/getters");

const { languageOrDefault } = getters;

const chatIdInContext = R.path(["chat", "id"]);

const fromIdInContext = R.path(["from", "id"]);

const messageIdInContext = R.path(["update", "message", "message_id"]);

const legibleUserInContext = R.compose(
  R.head,
  R.dropWhile(R.isNil),
  R.props(["username", "first_name", "last_name", "id"]),
  R.prop("from")
);

const messageInContext = R.path(["update", "message", "text"]);

const subCommandInContext = ctx => {
  const message = messageInContext(ctx);
  if (message[0] !== "/") {
    return undefined;
  }
  return R.pipe(
    R.split(" "),
    R.tail,
    R.join(" ")
  )(message);
};

/**
 * Catch and log any error that might occur further down the line.
 *
 * @param {*} ctx
 * @param {*} next
 */
const crashHandler = (ctx, next) => {
  return next().catch(console.log);
};

const translationMiddleware = ({ i18n, store }) => (ctx, next) => {
  const chatId = chatIdInContext(ctx);
  ctx.t = (key, params) => {
    const language = languageOrDefault(chatId, store);
    return i18n.t(key, { ...params, lng: language });
  };
  return next();
};

module.exports = {
  chatIdInContext,
  fromIdInContext,
  messageIdInContext,
  legibleUserInContext,
  messageInContext,
  subCommandInContext,
  crashHandler,
  translationMiddleware
};
