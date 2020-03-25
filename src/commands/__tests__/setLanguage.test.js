const { createStore } = require("redux");

const actions = require("../../store/actions");
const getters = require("../../store/getters");
const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducers");
const setLanguageCommand = require("../setLanguage");
const { translationMiddleware } = require("../../util/telegram");

describe("setLanguageCommand", () => {
  it("replies with infotext is no language was given", async () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const mockCtx = {
      chat: { id: chatId },
      update: { message: { text: "/setLanguage" } },
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.enableChat(chatId));
    setLanguageCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("command.setLanguage.no language given")
    );
  });

  it("replies with language unknown if the given languages is neither de nor en", async () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const mockCtx = {
      chat: { id: chatId },
      update: { message: { text: "/setLanguage fr" } },
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(actions.LANGUAGES.en, chatId));
    setLanguageCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("language.unknown", { language: "fr", lng: "en" })
    );
  });

  it("replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is de", async () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const mockCtx = {
      chat: { id: chatId },
      update: { message: { text: "/setLanguage de" } },
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    const dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(actions.LANGUAGES.en, chatId));
    setLanguageCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("language.changed"));
    expect(dispatchSpy).toHaveBeenCalledWith(actions.setLanguage("de", chatId));
    expect(getters.getLanguageInChat(chatId)(store.getState())).toEqual("de");
  });

  it("replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is en", async () => {
    const store = createStore(rootReducer);
    const chatId = "someChatId";
    const mockCtx = {
      chat: { id: chatId },
      update: { message: { text: "/setLanguage en" } },
      reply: jest.fn(),
    };

    translationMiddleware({ i18n, store })(mockCtx, () => {});

    const dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(actions.LANGUAGES.en, chatId));
    setLanguageCommand({ store })(mockCtx);

    expect(mockCtx.reply).toHaveBeenCalledWith(
      i18n.t("language.changed", { lng: "en" })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(actions.setLanguage("en", chatId));
  });
});
