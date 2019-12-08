const { createStore } = require("redux");
const Extra = require("telegraf/extra");

const i18n = require("../i18n");
const { leetBot: rootReducer } = require("../store/reducer");
const {
  enableCommand,
  disableCommand,
  getUserScoreCommand,
  setLanguageCommand,
  startCommand
} = require("../commands");
const {
  LANGUAGES,
  enableChat,
  disableChat,
  setLanguage,
  setUserScore
} = require("../store/actions");
const { getters } = require("../store/getters");
const { translationMiddleware } = require("../util/telegram");

const { languageInChat } = getters;

describe("commands", () => {
  describe("startCommand", () => {
    it("replies with the start label from i18n", async () => {
      const store = createStore(rootReducer);
      const mockCtx = {
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      startCommand({ store })(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("start"));
    });
  });

  describe("enableCommand", () => {
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

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("enable chat"));
      expect(dispatchSpy).toHaveBeenCalledWith(enableChat("someId"));
    });

    it("replies with the already enabled label if the chat is already enabled", () => {
      const store = createStore(rootReducer);
      const mockCtx = {
        chat: { id: "someId" },
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(enableChat("someId"));

      enableCommand({ store })(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("already enabled"));
    });
  });

  describe("disableCommand", () => {
    it("replies with the disable chat label and dispatches a disable chat action to the store if the chat is enabled", async () => {
      const store = createStore(rootReducer);
      const mockCtx = {
        chat: { id: "someId" },
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(enableChat("someId"));
      const dispatchSpy = jest.spyOn(store, "dispatch");

      disableCommand({ store })(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("disable chat"));
      expect(dispatchSpy).toHaveBeenCalledWith(disableChat("someId"));
    });

    it("replies with the already disabled label if the chat is not enabled", async () => {
      const store = createStore(rootReducer);
      const mockCtx = {
        chat: { id: "someId" },
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      disableCommand({ store })(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("already disabled"));
    });
  });

  describe("setLanguageCommand", () => {
    it("replies with infotext is no language was given", async () => {
      const store = createStore(rootReducer);
      const chatId = "someChatId";
      const mockCtx = {
        chat: { id: chatId },
        update: { message: { text: "/setLanguage" } },
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(enableChat(chatId));
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
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(enableChat(chatId));
      store.dispatch(setLanguage(LANGUAGES.en, chatId));
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
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      const dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch(enableChat(chatId));
      store.dispatch(setLanguage(LANGUAGES.en, chatId));
      setLanguageCommand({ store })(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(i18n.t("language.changed"));
      expect(dispatchSpy).toHaveBeenCalledWith(setLanguage("de", chatId));
      expect(languageInChat(chatId, store)).toEqual("de");
    });

    it("replies with language changed label, changes the i18n language and dispatches a change language action to the store if the given language is en", async () => {
      const store = createStore(rootReducer);
      const chatId = "someChatId";
      const mockCtx = {
        chat: { id: chatId },
        update: { message: { text: "/setLanguage en" } },
        reply: jest.fn()
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      const dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch(enableChat(chatId));
      store.dispatch(setLanguage(LANGUAGES.en, chatId));
      setLanguageCommand({ store })(mockCtx);

      expect(mockCtx.reply).toHaveBeenCalledWith(
        i18n.t("language.changed", { lng: "en" })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(setLanguage("en", chatId));
    });
  });

  describe("getUserScoreCommand", () => {
    it("does nothing when messaged in an inactive chat", () => {
      const store = createStore(rootReducer);
      const fromId = "someUserId";
      const chatId = "someChatId";
      const messageId = "someMessageId";
      const score = 0.27;
      const mockCtx = {
        chat: {
          id: chatId
        },
        from: {
          id: fromId
        },
        reply: jest.fn(),
        telegram: {
          sendMessage: jest.fn()
        },
        update: {
          message: {
            message_id: messageId
          }
        }
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(setUserScore(score, fromId));

      getUserScoreCommand({ i18n, store })(mockCtx);

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
          id: chatId
        },
        from: {
          id: fromId
        },
        reply: jest.fn(),
        telegram: {
          sendMessage: jest.fn()
        },
        update: {
          message: {
            message_id: messageId
          }
        }
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(enableChat(chatId));
      store.dispatch(setUserScore(score, fromId));

      getUserScoreCommand({ store })(mockCtx);

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
          id: chatId
        },
        from: {
          id: fromId
        },
        reply: jest.fn(),
        telegram: {
          sendMessage: jest.fn()
        },
        update: {
          message: {
            message_id: messageId
          }
        }
      };

      translationMiddleware({ i18n, store })(mockCtx, () => {});

      store.dispatch(setUserScore(score, fromId));

      getUserScoreCommand({ store })(mockCtx);

      expect(mockCtx.reply).not.toHaveBeenCalled();

      expect(mockCtx.telegram.sendMessage).toHaveBeenCalledWith(
        fromId,
        i18n.t("command.score.private", { score: score, lng: "de" })
      );
    });
  });
});
