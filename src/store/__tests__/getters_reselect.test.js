const { createStore } = require("redux");

const { leetBot } = require("../reducers");
const actions = require("../actions");

const uut = require("../getters_reselect");

describe("chatSelector", () => {
  const store = createStore(leetBot);
  const chatId = "someChat";
  store.dispatch(actions.enableChat(chatId));

  it("selects a chat", () => {
    const theSelectedChat = uut.chatSelector(chatId)(store.getState());
    const actualState = store.getState();

    expect(theSelectedChat).toStrictEqual(
      actualState.multiChatLeetCounter[chatId]
    );
  });
});

describe("isChatActive", () => {
  const store = createStore(leetBot);
  const chatId = "someChat";
  store.dispatch(actions.enableChat(chatId));

  it("returns false for inactive chats", () => {
    const theChatIsActive = uut.isChatActive("quatsch")(store.getState());

    expect(theChatIsActive).toBe(false);
  });
  it("returns true for active chats", () => {
    const theChatIsActive = uut.isChatActive(chatId)(store.getState());

    expect(theChatIsActive).toBe(true);
  });
});

describe("enabledChatIds", () => {
  const store = createStore(leetBot);
  const chatId = "someChat";
  store.dispatch(actions.enableChat(chatId));

  it("returns a list of enabled chat ids", () => {
    const theEnabledChatIds = uut.enabledChatIds()(store.getState());

    expect(theEnabledChatIds).toEqual([chatId]);
  });
});

describe("isLeetInChatAborted", () => {
  const store = createStore(leetBot);
  const chatIdNotAborted = "notAborted";
  const chatIdAborted = "aborted";
  store.dispatch(actions.enableChat(chatIdNotAborted));
  store.dispatch(actions.enableChat(chatIdAborted));
  store.dispatch(actions.abortLeet("me", chatIdAborted));

  it("returns true for an aborted chat", () => {
    const isAborted = uut.isLeetInChatAborted(chatIdAborted)(store.getState());
    expect(isAborted).toBe(true);
  });

  it("returns false for non-aborted chat", () => {
    const isAborted = uut.isLeetInChatAborted(chatIdNotAborted)(
      store.getState()
    );
    expect(isAborted).toBe(false);
  });
});

describe("leetPeopleInChat", () => {
  const store = createStore(leetBot);
  const chatId = "chatId";
  store.dispatch(actions.enableChat(chatId));

  it("returns an empty array by default", () => {
    const leetPeople = uut.leetPeopleInChat(chatId)(store.getState());
    expect(leetPeople).toStrictEqual([]);
  });

  it("returns leetPeople", () => {
    store.dispatch(actions.addLeetPerson("me", chatId));
    const leetPeople = uut.leetPeopleInChat(chatId)(store.getState());
    expect(leetPeople).toStrictEqual(["me"]);
  });
});

describe("isPersonInChatAlreadyLeet", () => {
  const store = createStore(leetBot);
  const chatId = "chatId";
  const somebody = "me";
  store.dispatch(actions.enableChat(chatId));
  it("returns false, if the person is not a leet person", () => {
    const amILeet = uut.isPersonInChatAlreadyLeet(
      somebody,
      chatId
    )(store.getState());
    expect(amILeet).toBe(false); // :C
  });
  it("returns true, if the person is a leet person", () => {
    store.dispatch(actions.addLeetPerson(somebody, chatId));
    const amILeet = uut.isPersonInChatAlreadyLeet(
      somebody,
      chatId
    )(store.getState());
    expect(amILeet).toBe(true); // Ü
  });
});

describe("leetCountInChat", () => {
  const store = createStore(leetBot);
  const chatId = "chatId";
  store.dispatch(actions.enableChat(chatId));
  it("returns 0 if there are no leet people", () => {
    const leetCount = uut.leetCountInChat(chatId)(store.getState());
    expect(leetCount).toBe(0);
  });
  it("returns the number of leet people", () => {
    store.dispatch(actions.addLeetPerson("me", chatId));
    store.dispatch(actions.addLeetPerson("you", chatId));
    const leetCount = uut.leetCountInChat(chatId)(store.getState());
    expect(leetCount).toBe(2);
  });
});

describe("recordInChat", () => {
  const store = createStore(leetBot);
  const chatId = "chatId";
  store.dispatch(actions.enableChat(chatId));
  it("returns 0 by default", () => {
    const record = uut.recordInChat(chatId)(store.getState());
    expect(record).toBe(0);
  });
  it("returns the current record", () => {
    store.dispatch(actions.updateRecord(1337, chatId));
    const record = uut.recordInChat(chatId)(store.getState());
    expect(record).toBe(1337);
  });
});

describe("userScore", () => {
  const store = createStore(leetBot);
  const userId = "userId";
  it("returns 0 by default", () => {
    const score = uut.userScore(userId)(store.getState());
    expect(score).toBe(0);
  });
  it("returns the user's score", () => {
    store.dispatch(actions.setUserScore(1337, userId));
    const score = uut.userScore(userId)(store.getState());
    expect(score).toBe(1337);
  });
});

describe("languageInChat", () => {
  const store = createStore(leetBot);
  const chatId = "chatId";
  store.dispatch(actions.enableChat(chatId));
  store.dispatch(actions.setLanguage(actions.LANGUAGES.en, chatId));
  it("returns the language currently set in the chat", () => {
    const theLanguage = uut.languageInChat(chatId)(store.getState());
    expect(theLanguage).toEqual(actions.LANGUAGES.en);
  });
});

describe("languageInChatOrDefault", () => {
  const store = createStore(leetBot);
  const chatId = "chatId";
  it("returns a default if the chat doesn't exist", () => {
    const theLanguage = uut.languageInChatOrDefault(chatId)(store.getState());
    expect(theLanguage).toEqual(actions.LANGUAGES.de);
  });
  it("returns the language currently set in the chat", () => {
    store.dispatch(actions.enableChat(chatId));
    store.dispatch(actions.setLanguage(actions.LANGUAGES.en, chatId));
    const theLanguage = uut.languageInChatOrDefault(chatId)(store.getState());
    expect(theLanguage).toEqual(actions.LANGUAGES.en);
  });
});
