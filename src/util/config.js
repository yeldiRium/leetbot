const R = require("ramda");

const { parseHours, parseMinutes } = require("./time");

const loadConfig = () => {
  const timezone = R.defaultTo("Europe/Berlin", process.env.TIMEZONE);
  console.log(`timezone: ${timezone}`);

  return {
    token: R.defaultTo("", process.env.LEETBOT_TOKEN),
    username: R.defaultTo("", process.env.LEETBOT_USERNAME),
    bot: {
      leetHours: parseHours(
        R.defaultTo(13, process.env.LEETBOT_HOURS),
        timezone
      ),
      leetMinutes: parseMinutes(
        R.defaultTo(37, process.env.LEETBOT_MINUTES),
        timezone
      ),
      dumpFile: String(
        R.defaultTo("./leetbot/dump.json", process.env.LEETBOT_DUMP_FILE)
      ),
      dumpCron: R.defaultTo("* * * * *", process.env.LEETBOT_DUMP_CRON),
      timezone,
      admin: process.env.LEETBOT_ADMIN
    }
  };
};

module.exports = { loadConfig };
