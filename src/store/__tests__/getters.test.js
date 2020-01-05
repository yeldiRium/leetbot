const { createStore } = require("redux");

const actions = require("../actions");
const getters = require("../getters");
const { leetBot } = require("../reducers");

describe("getChat", () => {
  it("returns the chat for the given id", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));

    const chat = getters.getChat(chatId)(store.getState());

    expect(chat).toStrictEqual(store.getState().multiChatLeetCounter[chatId]);
  });

  it("returns undefined if no chat can be found", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    const chat = getters.getChat(chatId)(store.getState());

    expect(chat).toBe(undefined);
  });
});

describe("doesChatExist", () => {
  it("returns true if the chat exists", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));

    const chatExists = getters.doesChatExist(chatId)(store.getState());

    expect(chatExists).toBe(true);
  });

  it("returns false if the chat does not exist", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    const chatExists = getters.doesChatExist(chatId)(store.getState());

    expect(chatExists).toBe(false);
  });
});

describe("isChatEnabled", () => {
  it("returns true for enabled chats", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));

    const theChatIsActive = getters.isChatEnabled(chatId)(store.getState());

    expect(theChatIsActive).toBe(true);
  });

  it("returns false for disabled chats", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.disableChat(chatId));

    const theChatIsActive = getters.isChatEnabled(chatId)(store.getState());

    expect(theChatIsActive).toBe(false);
  });
});

describe("getEnabledChatIds", () => {
  it("returns a list of enabled chat ids", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));

    const enabledChatIds = getters.getEnabledChatIds()(store.getState());

    expect(enabledChatIds).toEqual([chatId]);
  });
});

describe("isLeetInChatAborted", () => {
  it("returns true for an aborted chat", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.abortLeet("me", chatId));

    const isAborted = getters.isLeetInChatAborted(chatId)(store.getState());

    expect(isAborted).toBe(true);
  });

  it("returns false for a non-aborted chat", () => {
    const store = createStore(leetBot);
    const chatId = "someChat";

    store.dispatch(actions.enableChat(chatId));

    const isAborted = getters.isLeetInChatAborted(chatId)(store.getState());

    expect(isAborted).toBe(false);
  });
});

describe("getLeetPeopleInChat", () => {
  it("returns an empty array by default", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));

    const leetPeople = getters.getLeetPeopleInChat(chatId)(store.getState());

    expect(leetPeople).toStrictEqual([]);
  });

  it("returns the leet people in the chat", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.addLeetPerson("me", chatId));

    const leetPeople = getters.getLeetPeopleInChat(chatId)(store.getState());

    expect(leetPeople).toStrictEqual(["me"]);
  });
});

describe("isPersonInChatAlreadyLeet", () => {
  it("returns false if the person is not a leet person", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";
    const somebody = "me";

    store.dispatch(actions.enableChat(chatId));

    const amILeet = getters.isPersonInChatAlreadyLeet(
      somebody,
      chatId
    )(store.getState());

    expect(amILeet).toBe(false); // :C
  });

  it("returns true if the person is a leet person", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";
    const somebody = "me";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.addLeetPerson(somebody, chatId));

    const amILeet = getters.isPersonInChatAlreadyLeet(
      somebody,
      chatId
    )(store.getState());

    expect(amILeet).toBe(true); // Ü
  });
});

describe("getLeetCountInChat", () => {
  it("returns 0 if there are no leet people", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));

    const leetCount = getters.getLeetCountInChat(chatId)(store.getState());

    expect(leetCount).toBe(0);
  });

  it("returns the number of leet people", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.addLeetPerson("me", chatId));
    store.dispatch(actions.addLeetPerson("you", chatId));

    const leetCount = getters.getLeetCountInChat(chatId)(store.getState());

    expect(leetCount).toBe(2);
  });
});

describe("getRecordInChat", () => {
  it("returns 0 by default", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));

    const record = getters.getRecordInChat(chatId)(store.getState());

    expect(record).toBe(0);
  });

  it("returns the current record", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.updateRecord(1337, chatId));

    const record = getters.getRecordInChat(chatId)(store.getState());

    expect(record).toBe(1337);
  });
});

describe("getLanguageInChat", () => {
  it("returns the language currently set in the chat", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(actions.LANGUAGES.en, chatId));

    const theLanguage = getters.getLanguageInChat(chatId)(store.getState());

    expect(theLanguage).toEqual(actions.LANGUAGES.en);
  });

  it("returns a default if the chat doesn't exist", () => {
    const store = createStore(leetBot);
    const chatId = "chatId";

    const theLanguage = getters.getLanguageInChat(chatId)(store.getState());

    expect(theLanguage).toEqual(actions.LANGUAGES.de);
  });
});

describe("getUserScore", () => {
  it("returns 0 by default", () => {
    const store = createStore(leetBot);
    const userId = "userId";

    const score = getters.getUserScore(userId)(store.getState());

    expect(score).toBe(0);
  });

  it("returns the user's score", () => {
    const store = createStore(leetBot);
    const userId = "userId";

    store.dispatch(actions.setUserScore(1337, userId));

    const score = getters.getUserScore(userId)(store.getState());

    expect(score).toBe(1337);
  });
});
