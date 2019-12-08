const path = require("path");

const { flaschenpost } = require("flaschenpost");
const rc = require("rc");

const logger = flaschenpost.getLogger();

const loadConfig = () => {
  const config = rc("leetbot", {
    token: "",
    username: "YeldirsLeetBot",
    bot: {
      leetHour: 19,
      leetMinute: 29,
      timezone: "Europe/Berlin",
      dumpFile: path.join(".", "leetbot", "dump.json"),
      dumpCron: "* * * * *",
      admin: undefined
    }
  });

  logger.info("Configuration loaded.", {
    ...config,
    token: undefined
  });

  return config;
};

module.exports = { loadConfig };
