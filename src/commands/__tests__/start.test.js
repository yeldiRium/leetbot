const { createStore } = require("redux");

const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducers");
const { translationMiddleware } = require("../../util/telegram");

const startCommand = require("../start");

describe("start command", () => {
  it("replies with the start label from i18n", async () => {
    const store = createStore(rootReducer);
    const mockCtx = {
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    startCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("command.start"));
  });
});
