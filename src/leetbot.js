const { flaschenpost } = require("flaschenpost");
const { CronJob } = require("cron");
const Telegraf = require("telegraf");

const leet = require("./leet");
const telegramUtility = require("./util/telegram");
const { createStoreFromState, dumpState } = require("./persistence");
const commands = require("./commands");
const getters = require("./store/getters");
const i18n = require("./i18n");
const { leetBot: rootReducer } = require("./store/reducers");

const logger = flaschenpost.getLogger();

const scheduleJobs = ({
  bot,
  store,
  i18n,
  config: { dumpCron, dumpFile, leetHour, leetMinute, timezone },
}) => {
  const dumpStateCron = new CronJob(dumpCron, () => {
    logger.info("Dumping state.");
    dumpState(dumpFile, store.getState());
  });
  dumpStateCron.start();

  const reminderCron = new CronJob(
    `${leetMinute - 1} ${leetHour} * * *`,
    async () => {
      const chats = await leet.reminder(bot, store, i18n);
      logger.debug("Reminding chats resulted in pins/repins.", { chats });
      setTimeout(() => leet.reOrUnpin(bot, chats), 120 * 1000);
    },
    null,
    false,
    timezone
  );
  reminderCron.start();

  const countdownCron = new CronJob(
    `57 ${leetMinute - 1} ${leetHour} * * *`,
    async () => {
      await leet.countdown(bot, store);
    },
    null,
    false,
    timezone
  );
  countdownCron.start();

  const reportCron = new CronJob(
    `${leetMinute + 1} ${leetHour} * * *`,
    () => {
      leet.report(bot, store, i18n);
    },
    null,
    false,
    timezone
  );
  reportCron.start();
};

module.exports = (token, config, telegramOptions) => {
  // Set up the bot and its store and i18n.
  const bot = new Telegraf(token, telegramOptions);
  const store = createStoreFromState(rootReducer, config.dumpFile);

  // Schedule all constant bot-initiated workflows.
  scheduleJobs({ bot, store, i18n, config });

  bot.use(telegramUtility.crashHandler);
  bot.use(telegramUtility.translationMiddleware({ store, i18n }));
  bot.start(commands.start());
  bot.help(commands.help({ store, i18n }));
  bot.command("enable", commands.enable({ store }));
  bot.command("disable", commands.disable({ store }));
  bot.command("info", commands.info({ store, config }));
  bot.command("setLanguage", commands.setLanguage({ store }));
  if (process.env.NODE_ENV !== "production") {
    bot.command("debug", commands.debug({ store }));
  }
  bot.command("score", commands.score({ store }));
  bot.use(commands.watchLeet({ store, config }));

  // Start the bot.
  bot.startPolling();

  // Notify the admin about the start.
  getters
    .getEnabledChatIds()(store.getState())
    .forEach((chatId) => {
      const lng = getters.getLanguageInChat(chatId)(store.getState());
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
