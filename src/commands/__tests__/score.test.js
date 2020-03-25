const { createStore } = require("redux");
const Extra = require("telegraf/extra");

const actions = require("../../store/actions");
const scoreCommand = require("../score");
const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducers");
const { translationMiddleware } = require("../../util/telegram");

describe("scoreCommand", () => {
  it("does nothing when messaged in an inactive chat", () => {
    const store = createStore(rootReducer);
    const fromId = "someUserId";
    const chatId = "someChatId";
    const messageId = "someMessageId";
    const score = 0.27;
    const mockCtx = {
      chat: {
        id: chatId,
      },
      from: {
        id: fromId,
      },
      reply: jest.fn(),
      telegram: {
        sendMessage: jest.fn(),
      },
      update: {
        message: {
          message_id: messageId,
        },
      },
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.setUserScore(score, fromId));

    scoreCommand({ i18n, store })(mockCtx);

    expect(mockCtx.reply).not.toHaveBeenCalled();
    expect(mockCtx.telegram.sendMessage).not.toHaveBeenCalled();
  });

  it("flames sender and informes privately when called in group chat", () => {
    const store = createStore(rootReducer);
    const fromId = "someUserId";
    const chatId = "someChatId";
    const messageId = "someMessageId";
    const score = 0.27;
    const mockCtx = {
      chat: {
        id: chatId,
      },
      from: {
        id: fromId,
      },
      reply: jest.fn(),
      telegram: {
        sendMessage: jest.fn(),
      },
      update: {
        message: {
          message_id: messageId,
        },
      },
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setUserScore(score, fromId));

    scoreCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("command.score.group", { lng: "de" }),
      Extra.inReplyTo(messageId)
    );
    expect(mockCtx.telegram.sendMessage).toHaveBeenCalledWith(
      fromId,
      i18n.t("command.score.private", { score: score, lng: "de" })
    );
  });

  it("informs about the score when messaged privately", () => {
    const store = createStore(rootReducer);
    const fromId = "someUserId";
    const chatId = fromId;
    const messageId = "someMessageId";
    const score = 0.27;
    const mockCtx = {
      chat: {
        id: chatId,
      },
      from: {
        id: fromId,
      },
      reply: jest.fn(),
      telegram: {
        sendMessage: jest.fn(),
      },
      update: {
        message: {
          message_id: messageId,
        },
      },
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.setUserScore(score, fromId));

    scoreCommand({ store })(mockCtx);

    expect(mockCtx.reply).not.toHaveBeenCalled();

    expect(mockCtx.telegram.sendMessage).toHaveBeenCalledWith(
      fromId,
      i18n.t("command.score.private", { score: score, lng: "de" })
    );
  });
});
