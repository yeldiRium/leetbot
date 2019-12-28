const R = require("ramda");

const { chatIdInContext, subCommandInContext } = require("../util/telegram");
const { getters } = require("../store/getters");

const { languageOrDefault } = getters;

const listHelpCommand = () => ctx => {
  ctx.reply(
    ctx.t("command.available") +
      ":\n" +
      Object.keys(subCommands)
        .map(key => {
          return `/help ${key}`;
        })
        .join("\n")
  );
};

const languageHelpCommand = ({ i18n, store }) => ctx => {
  const lng = languageOrDefault(chatIdInContext(ctx), store);
  const languages = Object.keys(i18n.options.resources);
  ctx.reply(
    ctx.t("language.available") +
      ":\n" +
      languages
        .map(
          languageShort =>
            `${ctx.t(`language.list.${languageShort}`, {
              lng
            })} - /setLanguage ${languageShort}`
        )
        .join("\n")
  );
};

/**
 * This list of commands is what builds the output of `/help list` and also what
 * Drives the answers to the individual help commands.
 */
const subCommands = {
  list: listHelpCommand,
  language: languageHelpCommand
};

/**
 * The /help command.
 * Checks if a subcommand is sent and if so calls it. Otherwise replies with the
 * default help text.
 */
const help = ({ store, i18n }) => ctx => {
  const subCommand = subCommandInContext(ctx);

  if (!R.either(R.isNil, R.isEmpty)(subCommand)) {
    let [command, ...params] = subCommand.split(" ");

    if (command in subCommands) {
      return subCommands[command]({ store, i18n, params })(ctx);
    }
    return ctx.reply(ctx.t("command.unknown", { command }));
  }
  ctx.reply(ctx.t("command.help"));
};

module.exports = {
  help,
  languageHelpCommand,
  listHelpCommand,
  subCommands
};
