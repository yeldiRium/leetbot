const { createStore } = require("redux");

const actions = require("../../store/actions");
const enableCommand = require("../enable");
const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducers");
const { translationMiddleware } = require("../../util/telegram");

describe("enable command", () => {
  it("replies with the enable chat label and dispatches an enable chat action to the store if the chat is not yet enabled", () => {
    // A fresh store has no enabled chats
    const store = createStore(rootReducer);
    const mockCtx = {
      chat: { id: "someId" },
      reply: jest.fn()
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    const dispatchSpy = jest.spyOn(store, "dispatch");

    enableCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("command.enable.enabled")
    );
    expect(dispatchSpy).toHaveBeenCalledWith(actions.enableChat("someId"));
  });

  it("replies with the already enabled label if the chat is already enabled", () => {
    const store = createStore(rootReducer);
    const mockCtx = {
      chat: { id: "someId" },
      reply: jest.fn()
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.enableChat("someId"));

    enableCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("command.enable.already enabled")
    );
  });
});
