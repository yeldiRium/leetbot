const { flaschenpost } = require("flaschenpost");
const moment = require("moment-timezone");
const R = require("ramda");

const getters = require("./store/getters");
const { sample } = require("./util/random");
const { restartLeet, updateRecord } = require("./store/actions");

const logger = flaschenpost.getLogger();

const isCurrentlyLeet = (leetHour, leetMinute, timezone) => {
  const now = moment().tz(timezone);
  return now.hours() === leetHour && now.minutes() === leetMinute;
};

/**
 * Reminds all chats to 1337 soon. Resolves to a list of pairs of chatId and
 * either the id of an unpinned message or undefined:
 *
 * ```
 * [
 *   ["someChat", undefined],   // <- No message was pinned previously, so none
 *                                    has to be re-pinned
 *   ["anotherChat", 12345678]  // <- The id of the message to re-pin later.
 * ]
 * ```
 */
const reminder = async (bot, store, i18n) => {
  const chats = getters.getEnabledChatIds()(store.getState());
  logger.info("Reminding chats.", { chats });
  /*
   * Remind all chats; Do so by mapping all chat ids to promises and
   * awaiting them in parallel.
   */
  return Promise.all(
    chats.map(async chatId => {
      const chat = await bot.telegram.getChat(chatId);
      const previouslyPinnedMessageId = R.path(
        ["pinned_message", "message_id"],
        chat
      );

      try {
        // Retrieve list of phrases for reminding.
        const remindOptions = i18n.t("leet reminder", {
          lng: getters.getLanguageInChat(chatId)(store.getState()),
          returnObjects: true
        });

        // Send reminder to chat and store the message id for pinning.
        const {
          message_id: reminderMessageId
        } = await bot.telegram.sendMessage(chatId, sample(remindOptions));

        // Then pin the message.
        await bot.telegram.pinChatMessage(chatId, reminderMessageId);
      } catch {
        logger.warn("The leetbot could not send or pin a message.", {
          chat: chatId
        });
      }

      return [chatId, previouslyPinnedMessageId];
    })
  );
};

/**
 * Re-pins previously unpinned messages or unpins pinned messages.
 * This needs to be called after 1337ing with the results of the `remind`
 * function above.
 */
const reOrUnpin = async (bot, chats) => {
  logger.info("Re- and unpinning messages.", { chats });

  await Promise.all(
    chats.map(async ([chatId, unPinnedMessageId]) => {
      try {
        if (unPinnedMessageId !== undefined) {
          logger.info(`Repinning ${unPinnedMessageId} in ${chatId}`);
          bot.telegram.pinChatMessage(chatId, unPinnedMessageId, {
            disable_notification: true
          });
        } else {
          logger.info(`Unpinning in ${chatId}`);
          bot.telegram.unpinChatMessage(chatId);
        }
      } catch {
        logger.warn("The leetbot could not pin or unpin a message.", {
          chat: chatId
        });
      }
    })
  );
};

/**
 * Counts down for three seconds and sends messages to all enabled chats.
 */
const countdown = async (bot, store) => {
  const broadcastMessage = message => {
    return Promise.all(
      getters
        .getEnabledChatIds()(store.getState())
        .map(async chatId => {
          try {
            await bot.telegram.sendMessage(chatId, message);
          } catch {
            logger.warn("The leetbot could not send a message.", {
              chat: chatId
            });
          }
        })
    );
  };

  return new Promise((resolve, reject) => {
    broadcastMessage("T-3s").catch(reject);
    setTimeout(() => broadcastMessage("T-2s").catch(reject), 1000);
    setTimeout(() => broadcastMessage("T-1s").catch(reject), 2000);
    setTimeout(
      () =>
        broadcastMessage("1337")
          .then(resolve)
          .catch(reject),
      3000
    );
  });
};

/**
 * Reports the stats after a 1337ing session and restarts the counters.
 */
const report = async (bot, store, i18n) => {
  const chats = getters.getEnabledChatIds()(store.getState());

  logger.info("Reporting to chats.", { chats });

  await Promise.all(
    chats.map(async chatId => {
      if (getters.isLeetInChatAborted(chatId)(store.getState())) {
        return store.dispatch(restartLeet(chatId));
      }

      const leetPeople = getters.getLeetPeopleInChat(chatId)(store.getState());
      const leetCount = getters.getLeetCountInChat(chatId)(store.getState());
      const previousRecord = getters.getRecordInChat(chatId)(store.getState());
      const language = getters.getLanguageInChat(chatId)(store.getState());

      let report = "";

      if (leetCount === 0) {
        report = i18n.t("report.noone");
      } else {
        report +=
          i18n.t("report.leetCount", {
            count: leetCount,
            lng: language
          }) + "\n\n";

        if (leetCount > previousRecord) {
          store.dispatch(updateRecord(leetCount, chatId));
          report +=
            i18n.t("report.newRecord", {
              delta: leetCount - previousRecord,
              lng: language
            }) + "\n\n";
        }

        if (leetCount === 1) {
          report +=
            i18n.t("report.participant", {
              participants: leetPeople[0],
              lng: language
            }) + "\n\n";
        } else {
          report +=
            i18n.t("report.participants", {
              participants: leetPeople.join(", "),
              lng: language
            }) + "\n\n";
        }

        report += i18n.t("report.congratulations", { lng: language });
      }

      await bot.telegram
        .sendMessage(chatId, report)
        /*
         * This might not work for various reasons. E.g. the bot is restricted in
         * the chat or was kicked from the group without disabling beforehand.
         * Thus detailed error handling makes no sense here.
         */
        .catch(() => {
          logger.warn("The leetbot could not send a message.", {
            chat: chatId
          });
        });

      return store.dispatch(restartLeet(chatId));
    })
  );
};

module.exports = {
  countdown,
  report,
  isCurrentlyLeet,
  reminder,
  reOrUnpin
};
