const path = require("path");

const { flaschenpost } = require("flaschenpost");
const parseStringsInObject = require("parse-strings-in-object");
const rc = require("rc");

const logger = flaschenpost.getLogger();

const loadConfig = () => {
  const config = parseStringsInObject(
    rc("leetbot", {
      token: "",
      username: "YeldirsLeetBot",
      bot: {
        leetHour: 13,
        leetMinute: 37,
        timezone: "Europe/Berlin",
        dumpFile: path.join(".", "leetbot", "dump.json"),
        dumpCron: "* * * * *",
        admin: undefined,
      },
    })
  );

  logger.info("Configuration loaded.", {
    ...config,
    token: undefined,
  });

  return config;
};

module.exports = { loadConfig };
