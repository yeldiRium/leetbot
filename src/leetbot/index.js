const moment = require("moment-timezone");
const scheduler = require("node-schedule");
const Telegraf = require("telegraf");

const { countDown, dailyReporter, reminder, reOrUnpin } = require("./leet");
const { crashHandler, translationMiddleware } = require("../util/telegram");
const { createStoreFromState, dumpState } = require("./persistence");
const {
  enableCommand,
  debugCommand,
  disableCommand,
  getUserScoreCommand,
  infoCommand,
  resetCommand,
  setLanguageCommand,
  startCommand,
  watchLeetCommand
} = require("./commands");
const { getters } = require("./store/getters");
const { helpCommand } = require("./commands/help");
const i18n = require("./i18n");
const { leetBot: rootReducer } = require("./store/reducer");

const { enabledChats, languageOrDefault } = getters;

const scheduleJobs = ({
  bot,
  store,
  i18n,
  config: { dumpCron, dumpFile, leetHours, leetMinutes }
}) => {
  scheduler.scheduleJob(dumpCron, () => {
    console.log("dumping state");
    dumpState(dumpFile, store.getState());
  });
  scheduler.scheduleJob(`${leetMinutes - 1} ${leetHours} * * *`, async () => {
    const chats = await reminder(bot, store, i18n);
    console.log("reminding chats resulted in following pins/repins:", chats);
    scheduler.scheduleJob(
      moment()
        .seconds(0)
        .minutes(leetMinutes + 1)
        .toDate(),
      () => reOrUnpin(bot, chats)
    );
  });
  scheduler.scheduleJob(`57 ${leetMinutes - 1} ${leetHours} * * *`, () => {
    countDown(bot, store);
  });
  scheduler.scheduleJob(`${leetMinutes + 1} ${leetHours} * * *`, () => {
    dailyReporter(bot, store, i18n);
  });
};

module.exports = (token, config, telegramOptions) => {
  // Set up the bot and its store and i18n.
  const bot = new Telegraf(token, telegramOptions);
  const store = createStoreFromState(rootReducer, config.dumpFile);

  // Schedule all constant bot-initiated workflows.
  scheduleJobs({ bot, store, i18n, config });

  bot.use(crashHandler);
  bot.use(translationMiddleware({ store, i18n }));
  bot.start(startCommand());
  bot.help(helpCommand({ store, i18n }));
  bot.command("enable", enableCommand({ store }));
  bot.command("disable", disableCommand({ store }));
  bot.command("info", infoCommand({ store, config }));
  bot.command("setLanguage", setLanguageCommand({ store }));
  bot.command("debug", debugCommand({ store }));
  bot.command("reset", resetCommand({ store }));
  bot.command("score", getUserScoreCommand({ store }));
  bot.hears(/.*/, watchLeetCommand({ store, config }));

  // Start the bot.
  bot.startPolling();

  // Notify the admin about the start.
  enabledChats(store).forEach(chatId => {
    const lng = languageOrDefault(chatId, store);
    bot.telegram.sendMessage(
      chatId,
      i18n.t("deployed", { version: config.version, lng })
    );
  });
  if (config.admin) {
    bot.telegram.sendMessage(
      config.admin,
      i18n.t("deployed", { version: config.version })
    );
  }
};
