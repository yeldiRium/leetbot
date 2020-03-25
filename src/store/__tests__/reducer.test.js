const { createStore } = require("redux");

const {
  LANGUAGES,
  abortLeet,
  addLeetPerson,
  disableChat,
  enableChat,
  restartLeet,
  setLanguage,
  setUserScore,
  updateRecord,
} = require("../actions");
const {
  chat,
  language,
  leetBot,
  leetCounter,
  chats,
  userScores,
} = require("../reducers");

const noopAction = {
  type: "NOOP",
};

describe("leetCounter", () => {
  it("initializes its state to an empty list and no asshole", () => {
    expect(leetCounter(undefined, noopAction)).toEqual({
      leetPeople: [],
      asshole: null,
      record: 0,
    });
  });

  it("handles ADD_LEET_PERSON actions by adding the person to the list. does not affect record", () => {
    const store = createStore(leetCounter);
    const testPerson = "somePerson";

    store.dispatch(addLeetPerson(testPerson, "irrelevantChatId"));

    expect(store.getState()).toEqual({
      leetPeople: [testPerson],
      asshole: null,
      record: 0,
    });
  });

  it("handles ABORT_LEET actions by setting the asshole and leaving the rest as is", () => {
    const store = createStore(leetCounter);
    const testPerson = "somePerson";
    const asshole = "someAsshole";

    store.dispatch(addLeetPerson(testPerson, "irrelevantChatId"));
    store.dispatch(abortLeet(asshole, "irrelevantChatId"));

    expect(store.getState()).toMatchObject({
      leetPeople: [testPerson],
      asshole: asshole,
    });
  });

  it("handles RESTART_LEET actions by resetting leetPeople to the initial state", () => {
    const store = createStore(leetCounter);
    const testPerson = "somePerson";

    store.dispatch(addLeetPerson(testPerson, "irrelevantChatId"));
    store.dispatch(restartLeet("irrelevantChatId"));

    expect(store.getState()).toMatchObject({
      leetPeople: [],
      asshole: null,
    });
  });

  it("handles RESTART_LEET actions by resetting leetPeople and asshole to the initial state", () => {
    const store = createStore(leetCounter);
    const testPerson = "somePerson";
    const asshole = "someAsshole";

    store.dispatch(addLeetPerson(testPerson, "irrelevantChatId"));
    store.dispatch(abortLeet(asshole, "irrelevantChatId"));
    store.dispatch(restartLeet("irrelevantChatId"));

    expect(store.getState()).toMatchObject({
      leetPeople: [],
      asshole: null,
    });
  });

  it("handles RESTART_LEET and leaves record intact", () => {
    const store = createStore(leetCounter);
    const newRecord = 5;

    store.dispatch(updateRecord(newRecord, "irrelevantChatId"));
    store.dispatch(restartLeet("irrelevantChatId"));

    expect(store.getState()).toMatchObject({
      record: newRecord,
    });
  });

  it("handles UPDATE_RECORD actions by setting the record field", () => {
    const store = createStore(leetCounter);
    const newRecord = 5;

    store.dispatch(updateRecord(newRecord, "irrelevantChatId"));

    expect(store.getState()).toMatchObject({
      record: newRecord,
    });
  });
});

describe("chat", () => {
  it("initializes to a leetCounter and a language", () => {
    const store = createStore(chat);
    const irrelevantAction = { type: "irrelevant" };

    const expectation = {
      leetCounter: leetCounter(undefined, irrelevantAction),
      language: language(undefined, irrelevantAction),
    };

    expect(store.getState()).toEqual(expectation);
  });
});

describe("chats", () => {
  it("initializes to an empty object", () => {
    const store = createStore(chats);

    expect(store.getState()).toEqual({});
  });

  it("handles enableChat by adding a new chat object", () => {
    const store = createStore(chats);
    const chatId = "someChatId";
    const enableChatAction = enableChat(chatId);

    store.dispatch(enableChatAction);

    expect(store.getState()).toEqual({
      [chatId]: chat(undefined, enableChatAction),
    });
  });

  it("replaces an existing chat on enableChat", () => {
    const store = createStore(chats);
    const chatId = "someChatId";
    const asshole = "someAsshole";

    store.dispatch(enableChat(chatId));
    store.dispatch(abortLeet(asshole, chatId));

    const chatState = store.getState()[chatId];

    store.dispatch(enableChat(chatId));

    const chatStateAfter = store.getState()[chatId];

    expect(chatStateAfter).not.toEqual(chatState);
  });

  it("handles disableChat by removing an existing chat", () => {
    const store = createStore(chats);
    const chatId = "someChatId";
    const enableChatAction = enableChat(chatId);

    store.dispatch(enableChatAction);

    expect(store.getState()).toEqual({
      [chatId]: chat(undefined, enableChatAction),
    });

    store.dispatch(disableChat(chatId));

    expect(Object.keys(store.getState())).toEqual([]);
    expect(store.getState()).toEqual({});
  });

  it("passes SET_USER_SCORE on to the userScore reducer", () => {
    const store = createStore(leetBot);
    store.dispatch(setUserScore(0.28, "someUserId"));

    expect(store.getState()).toEqual({
      chats: {},
      userScores: {
        someUserId: 0.28,
      },
    });
  });
});

describe("language", () => {
  it("initializes to german", () => {
    const store = createStore(language);

    expect(store.getState()).toEqual(LANGUAGES.de);
  });

  it("stores the given language", () => {
    const store = createStore(language);

    store.dispatch(setLanguage(LANGUAGES.en));

    expect(store.getState()).toEqual(LANGUAGES.en);
  });
});

describe("userScores", () => {
  it("initializes to an empty object", () => {
    const store = createStore(userScores);

    expect(store.getState()).toEqual({});
  });

  it("updates the given user's score", () => {
    const store = createStore(userScores);

    store.dispatch(setUserScore(0.78, "someUserId"));

    expect(store.getState()).toEqual({
      someUserId: 0.78,
    });
  });

  it("replaces the given user's score", () => {
    const store = createStore(userScores);

    store.dispatch(setUserScore(0.78, "someUserId"));

    expect(store.getState()).toEqual({
      someUserId: 0.78,
    });

    store.dispatch(setUserScore(0.22, "someUserId"));

    expect(store.getState()).toEqual({
      someUserId: 0.22,
    });
  });

  it("integrates well in a store without userScores", () => {
    const store = createStore(chats, {
      someChatId: leetCounter(undefined, { type: "whatever" }),
    });

    expect(store.getState()).toEqual({
      someChatId: leetCounter(undefined, { type: "whatever" }),
    });
  });
});

describe("leetBot", () => {
  it("initializes to chats and userScores", () => {
    const store = createStore(leetBot);

    expect(store.getState()).toEqual({
      chats: {},
      userScores: {},
    });
  });

  it("passes actions to the chats", () => {
    const store = createStore(leetBot);
    const enableChatAction = enableChat("someChatId");

    store.dispatch(enableChatAction);

    expect(store.getState()).toEqual({
      chats: chats(undefined, enableChatAction),
      userScores: {},
    });
  });

  it("passes actions to the userScores", () => {
    const store = createStore(leetBot);
    const setUserScoreAction = setUserScore(0.1337, "someUserId");

    store.dispatch(setUserScoreAction);

    expect(store.getState()).toEqual({
      chats: {},
      userScores: userScores(undefined, setUserScoreAction),
    });
  });
});
