const R = require("ramda");

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

module.exports = {
  chatIdInContext,
  fromIdInContext,
  messageIdInContext,
  legibleUserInContext,
  messageInContext,
  subCommandInContext,
  crashHandler
};
