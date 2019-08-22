const { loadConfig } = require("../config");

describe("loadConfig", () => {
  beforeEach(() => {
    delete process.env.TIMEZONE;
    delete process.env.LEETBOT_TOKEN;
    delete process.env.LEETBOT_USERNAME;
    delete process.env.LEETBOT_HOURS;
    delete process.env.LEETBOT_MINUTES;
    delete process.env.LEETBOT_DUMP_FILE;
    delete process.env.LEETBOT_DUMP_CRON;
    delete process.env.LEETBOT_ADMIN;
  });

  it("should read environment variables correctly calculate hours/minutes according to timezone", () => {
    process.env.TIMEZONE = "Europe/Moscow"; // UTC+3
    process.env.LEETBOT_TOKEN = "leetbotToken";
    process.env.LEETBOT_USERNAME = "fxqelainxq";
    process.env.LEETBOT_HOURS = "10"; // => 7
    process.env.LEETBOT_MINUTES = "12";
    process.env.LEETBOT_DUMP_FILE = "sooomewhere";
    process.env.LEETBOT_DUMP_CRON = "somecron";
    process.env.LEETBOT_ADMIN = "omgWas1Admin";

    const config = loadConfig();

    expect(config.examplebot.config).toEqual({});
    expect(config.token).toBe(process.env.LEETBOT_TOKEN);
    expect(config.username).toBe(process.env.LEETBOT_USERNAME);
    expect(config.bot.leetHours).toBe(7);
    expect(config.bot.leetMinutes).toBe(Number(process.env.LEETBOT_MINUTES));
    expect(config.bot.dumpFile).toBe(process.env.LEETBOT_DUMP_FILE);
    expect(config.bot.dumpCron).toBe(process.env.LEETBOT_DUMP_CRON);
    expect(config.bot.timezone).toBe(process.env.TIMEZONE);
    expect(config.bot.admin).toBe(process.env.LEETBOT_ADMIN);
  });

  it("should set sensible default values", () => {
    const config = loadConfig();

    expect(config.token).toBe("");
    expect(config.username).toBe("");
    expect(config.bot.leetHours).toBe(11); // UTC+1 by default
    expect(config.bot.leetMinutes).toBe(37);
    expect(config.bot.dumpFile).toBe("./leetbot/dump.json");
    expect(config.bot.dumpCron).toBe("* * * * *");
    expect(config.bot.timezone).toBe("Europe/Berlin");
    expect(config.bot.admin).toBe(undefined);
  });
});
