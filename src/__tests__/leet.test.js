const { stripIndent } = require("common-tags");
const { createStore } = require("redux");

const actions = require("../store/actions");
const i18n = require("../i18n");
const { leetBot: reducer } = require("../store/reducer");
const { countdown, reminder, reOrUnpin, report } = require("../leet");

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

describe("reminder", () => {
  const chatId = "someChatIdIGuess";
  const messageId = "someMessageId";
  const previousMessageId = "someOlderMessageId";
  const chatLanguage = "en";

  it("sends a message to each chat and pins it, returns the chatIds with their corresponding previouslyPinnedMessageIds", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({ message_id: messageId }),
        pinChatMessage: jest.fn().mockResolvedValue({}),
        getChat: aChatId => {
          return {
            [chatId]: {
              pinned_message: {
                message_id: previousMessageId
              }
            }
          }[aChatId];
        }
      }
    };
    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(chatLanguage, chatId));

    const chats = await reminder(bot, store, i18n);

    expect(chats).toEqual([[chatId, previousMessageId]]);
    expect(bot.telegram.sendMessage).toHaveBeenCalled();
    expect(bot.telegram.sendMessage.mock.calls[0][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[0][1]).toBeOneOf(
      i18n.t("leet reminder", {
        lng: chatLanguage,
        returnObjects: true
      })
    );
    expect(bot.telegram.pinChatMessage).toHaveBeenCalledWith(chatId, messageId);
  });

  it("return undefined for chats with no pinned message", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({ message_id: messageId }),
        pinChatMessage: jest.fn().mockResolvedValue({}),
        getChat: aChatId => {
          return {
            [chatId]: {}
          }[aChatId];
        }
      }
    };
    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    const chats = await reminder(bot, store, i18n);

    expect(chats).toEqual([[chatId, undefined]]);
  });

  it("does not crash if it cannot send a message", async () => {
    const bot = {
      telegram: {
        sendMessage: async () => {
          throw new Error();
        },
        pinChatMessage: jest.fn().mockResolvedValue({}),
        getChat: aChatId => {
          return {
            [chatId]: {}
          }[aChatId];
        }
      }
    };
    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    expect(await reminder(bot, store, i18n)).toStrictEqual([
      [chatId, undefined]
    ]);
  });

  it("does not crash if it cannot pin a message", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({ message_id: messageId }),
        pinChatMessage: async () => {},
        getChat: aChatId => {
          return {
            [chatId]: {}
          }[aChatId];
        }
      }
    };
    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    expect(await reminder(bot, store, i18n)).toStrictEqual([
      [chatId, undefined]
    ]);
  });
});

describe("reOrUnpin", () => {
  const chatId = "someChatIdIGuess";
  const messageId = "someMessageId";

  it("unpins the current pin if no previous message id is given", async () => {
    const bot = {
      telegram: {
        pinChatMessage: jest.fn().mockResolvedValue({}),
        unpinChatMessage: jest.fn().mockResolvedValue({})
      }
    };

    await reOrUnpin(bot, [[chatId, undefined]]);

    expect(bot.telegram.unpinChatMessage).toHaveBeenCalledWith(chatId);
  });

  it("pins the given previous message and does not notify about it", async () => {
    const bot = {
      telegram: {
        pinChatMessage: jest.fn().mockResolvedValue({}),
        unpinChatMessage: jest.fn().mockResolvedValue({})
      }
    };

    await reOrUnpin(bot, [[chatId, messageId]]);

    expect(bot.telegram.pinChatMessage).toHaveBeenCalledWith(
      chatId,
      messageId,
      { disable_notification: true }
    );
  });

  it("does not crash if it cannot pin a message", async () => {
    const bot = {
      telegram: {
        pinChatMessage: jest.fn().mockResolvedValue({}),
        unpinChatMessage: jest.fn().mockResolvedValue({})
      }
    };

    expect(await reOrUnpin(bot, [[chatId, messageId]])).toBe(undefined);
  });

  it("does not crash if it cannot unpin a message", async () => {
    const bot = {
      telegram: {
        pinChatMessage: jest.fn().mockResolvedValue({}),
        unpinChatMessage: jest.fn().mockResolvedValue({})
      }
    };

    expect(await reOrUnpin(bot, [[chatId, undefined]])).toBe(undefined);
  });
});

describe("countdown", () => {
  const chatId = "someChatIdIGuess";

  it("sends a countdown to all enabled chats", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    countdown(bot, store);

    await sleep(4000);

    expect(bot.telegram.sendMessage.mock.calls.length).toBe(4);
    expect(bot.telegram.sendMessage.mock.calls[0][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[0][1]).toBe("T-3s");
    expect(bot.telegram.sendMessage.mock.calls[1][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[1][1]).toBe("T-2s");
    expect(bot.telegram.sendMessage.mock.calls[2][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[2][1]).toBe("T-1s");
    expect(bot.telegram.sendMessage.mock.calls[3][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[3][1]).toBe("1337");
  });

  it("stops sending in between countdown messages if a chat is disabled", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    countdown(bot, store);

    await sleep(1500);

    store.dispatch(actions.disableChat(chatId));

    await sleep(2500);

    expect(bot.telegram.sendMessage.mock.calls.length).toBe(2);
    expect(bot.telegram.sendMessage.mock.calls[0][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[0][1]).toBe("T-3s");
    expect(bot.telegram.sendMessage.mock.calls[1][0]).toBe(chatId);
    expect(bot.telegram.sendMessage.mock.calls[1][1]).toBe("T-2s");
  });

  it("does not crash if it cannot send a message", async () => {
    const bot = {
      telegram: {
        sendMessage: async () => {
          throw new Error();
        }
      }
    };
    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    countdown(bot, store);

    await sleep(4000);

    // If this didn't work, node would've crashed.
  });
});

describe("report", () => {
  const chatId = "someChatIdIGuess";
  const chatLanguage = "en";

  it("reports that noone has participated", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    await report(bot, store, i18n);

    expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
      chatId,
      `${i18n.t("report.noone")}`
    );
  });

  it("reports that one person has participated and no new record has been set", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(chatLanguage, chatId));
    store.dispatch(actions.updateRecord(200, chatId));
    store.dispatch(actions.addLeetPerson("yeldiR", chatId));

    await report(bot, store, i18n);

    expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
      chatId,
      stripIndent`
      ${i18n.t("report.leetCount", { count: 1, lng: chatLanguage })}

      ${i18n.t("report.participant", {
        participants: "yeldiR",
        lng: chatLanguage
      })}

      ${i18n.t("report.congratulations", { lng: chatLanguage })}`
    );
  });

  it("reports that one person has participated and a new record has been set", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(chatLanguage, chatId));
    store.dispatch(actions.updateRecord(0, chatId));
    store.dispatch(actions.addLeetPerson("yeldiR", chatId));

    await report(bot, store, i18n);

    expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
      chatId,
      stripIndent`
      ${i18n.t("report.leetCount", { count: 1, lng: chatLanguage })}

      ${i18n.t("report.newRecord", {
        delta: 1,
        lng: chatLanguage
      })}

      ${i18n.t("report.participant", {
        participants: "yeldiR",
        lng: chatLanguage
      })}

      ${i18n.t("report.congratulations", { lng: chatLanguage })}`
    );
  });

  it("reports that people have participated and no new record has been set", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(chatLanguage, chatId));
    store.dispatch(actions.updateRecord(200, chatId));
    store.dispatch(actions.addLeetPerson("yeldiR", chatId));
    store.dispatch(actions.addLeetPerson("MeisterRados", chatId));
    store.dispatch(actions.addLeetPerson("strangedev", chatId));

    await report(bot, store, i18n);

    expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
      chatId,
      stripIndent`
      ${i18n.t("report.leetCount", { count: 3, lng: chatLanguage })}

      ${i18n.t("report.participants", {
        participants: ["yeldiR", "MeisterRados", "strangedev"].join(", "),
        lng: chatLanguage
      })}

      ${i18n.t("report.congratulations", { lng: chatLanguage })}`
    );
  });

  it("reports that people have participated and a new record has been set", async () => {
    const bot = {
      telegram: {
        sendMessage: jest.fn().mockResolvedValue({})
      }
    };

    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(chatLanguage, chatId));
    store.dispatch(actions.updateRecord(0, chatId));
    store.dispatch(actions.addLeetPerson("yeldiR", chatId));
    store.dispatch(actions.addLeetPerson("MeisterRados", chatId));
    store.dispatch(actions.addLeetPerson("strangedev", chatId));

    await report(bot, store, i18n);

    expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
      chatId,
      stripIndent`
      ${i18n.t("report.leetCount", { count: 3, lng: chatLanguage })}

      ${i18n.t("report.newRecord", {
        delta: 3,
        lng: chatLanguage
      })}

      ${i18n.t("report.participants", {
        participants: ["yeldiR", "MeisterRados", "strangedev"].join(", "),
        lng: chatLanguage
      })}

      ${i18n.t("report.congratulations", { lng: chatLanguage })}`
    );
  });

  it("does not crash if it cannot send a message", async () => {
    const bot = {
      telegram: {
        sendMessage: async () => {
          throw new Error();
        }
      }
    };
    const store = createStore(reducer);
    store.dispatch(actions.enableChat(chatId));

    expect(await report(bot, store, i18n)).toBe(undefined);
  });
});
