const { createStore } = require("redux");

const actions = require("../../store/actions");
const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducers");
const moment = require("moment-timezone");
const watchLeetCommand = require("../watchLeet");
const timekeeper = require("timekeeper");
const { translationMiddleware } = require("../../util/telegram");

describe("watchLeetCommand", () => {
  const config = {
    leetHour: 13,
    leetMinute: 37,
    timezone: "Europe/Berlin",
  };
  const duringLeet = moment()
    .tz(config.timezone)
    .hours(config.leetHour)
    .minutes(config.leetMinute)
    .seconds(30);
  // Just some time outside let. Make sure the hour doesn't exceed 24 when
  // changing this.
  const outsideLeet = moment()
    .tz(config.timezone)
    .hours(config.leetHour + 3);

  it("replies to 1337 messages while it is not leet time", () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const mockCtx = {
      chat: { id: chatId },
      update: { message: { text: "1337" } },
      reply: jest.fn(),
    };

    timekeeper.freeze(outsideLeet.toDate());

    translationMiddleware({ i18n, store })(mockCtx, () => {});
    store.dispatch(actions.enableChat(chatId));
    watchLeetCommand({ store, config })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalled();

    timekeeper.reset();
  });

  it("does not reply to 1337 during leet", () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const fromId = "someUserId";
    const mockCtx = {
      chat: { id: chatId },
      from: { id: fromId },
      update: { message: { text: "1337" } },
      reply: jest.fn(),
    };

    timekeeper.freeze(duringLeet.toDate());

    translationMiddleware({ i18n, store })(mockCtx, () => {});
    store.dispatch(actions.enableChat(chatId));
    watchLeetCommand({ store, config })(mockCtx);

    expect(mockCtx.reply).not.toHaveBeenCalled();

    timekeeper.reset();
  });

  it("replies to non-1337 messages during leet", () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const fromId = "someUserId";
    const mockCtx = {
      chat: { id: chatId },
      from: { id: fromId },
      update: { message: { text: "some stupid shit" } },
      reply: jest.fn(),
    };

    timekeeper.freeze(duringLeet.toDate());

    translationMiddleware({ i18n, store })(mockCtx, () => {});
    store.dispatch(actions.enableChat(chatId));
    watchLeetCommand({ store, config })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalled();

    timekeeper.reset();
  });

  it("replies to multiple 1337 messages from the same person during leet", () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const fromId = "someUserId";
    const mockCtx = {
      chat: { id: chatId },
      from: { id: fromId },
      update: { message: { text: "some stupid shit" } },
      reply: jest.fn(),
    };

    timekeeper.freeze(duringLeet.toDate());

    translationMiddleware({ i18n, store })(mockCtx, () => {});
    store.dispatch(actions.enableChat(chatId));

    watchLeetCommand({ store, config })(mockCtx);
    watchLeetCommand({ store, config })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalled();

    timekeeper.reset();
  });
});
