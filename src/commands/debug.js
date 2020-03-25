/**
 * Dumps the current store state into the chat.
 */
const debug = ({ store }) => (ctx) => {
  ctx.reply(JSON.stringify(store.getState(), null, 2));
};

module.exports = debug;
