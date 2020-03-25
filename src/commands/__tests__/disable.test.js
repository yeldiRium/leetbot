const { createStore } = require("redux");

const actions = require("../../store/actions");
const disableCommand = require("../disable");
const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducers");
const { translationMiddleware } = require("../../util/telegram");

describe("disableCommand", () => {
  it("replies with the disable chat label and dispatches a disable chat action to the store if the chat is enabled", async () => {
    const store = createStore(rootReducer);
    const mockCtx = {
      chat: { id: "someId" },
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.enableChat("someId"));
    const dispatchSpy = jest.spyOn(store, "dispatch");

    disableCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("command.disable.disabled")
    );
    expect(dispatchSpy).toHaveBeenCalledWith(actions.disableChat("someId"));
  });

  it("replies with the already disabled label if the chat is not enabled", async () => {
    const store = createStore(rootReducer);
    const mockCtx = {
      chat: { id: "someId" },
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    disableCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("command.disable.already disabled")
    );
  });
});
