const { createStore } = require("redux");

const { helpCommand, subCommands } = require("../help");
const i18n = require("../../i18n");
const { leetBot: rootReducer } = require("../../store/reducer");
const { translationMiddleware } = require("../../util/telegram");

describe("helpCommand", () => {
  let store;
  let help;

  beforeEach(() => {
    store = createStore(rootReducer);
    help = helpCommand({
      store: createStore(rootReducer),
      i18n
    });
  });

  const makeDummyContextWithMessage = message => {
    const ctx = {
      update: { message: { text: message } },
      reply: jest.fn(),
      t: i18n.t
    };

    translationMiddleware({ i18n, store })(ctx, () => {});

    return ctx;
  };

  it("is a function", () => {
    expect(typeof helpCommand).toBe("function");
  });

  it("accepts options and returns a function", () => {
    expect(typeof help).toBe("function");
  });

  it("responds with the generic help if no subcommand is given", () => {
    const ctx = makeDummyContextWithMessage("/help");
    help(ctx);
    expect(ctx.reply).toBeCalledWith(i18n.t("help"));
  });

  it("responds with the unknown command message if an unknown subcommand is given", () => {
    const command = "8ne194lgu";
    const ctx = makeDummyContextWithMessage(`/help ${command}`);
    help(ctx);
    expect(ctx.reply).toBeCalledWith(i18n.t("command unknown", { command }));
  });

  describe("list", () => {
    it("responds with a list of commands when /help list is called", () => {
      const ctx = makeDummyContextWithMessage("/help list");
      const expectedAnswer =
        i18n.t("available commands") +
        ":\n" +
        Object.keys(subCommands)
          .map(key => {
            return `/help ${key}`;
          })
          .join("\n");
      help(ctx);
      expect(ctx.reply).toBeCalledWith(expectedAnswer);
    });
  });

  describe("language", () => {
    it("responds with a list of available languages and commands when /help language is called", () => {
      const ctx = makeDummyContextWithMessage("/help language");
      const languages = Object.keys(i18n.options.resources);
      const expectedAnswer =
        i18n.t("language.available") +
        ":\n" +
        languages
          .map(
            languageShort =>
              `${i18n.t(
                `language.list.${languageShort}`
              )} - /setLanguage ${languageShort}`
          )
          .join("\n");
      help(ctx);
      expect(ctx.reply).toBeCalledWith(expectedAnswer);
    });
  });
});
