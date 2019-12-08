const path = require("path");

const { nodeenv } = require("nodeenv");

const { loadConfig } = require("../config");

describe("loadConfig", () => {
  it("should read environment variables correctly calculate hours/minutes according to timezone", () => {
    const restore = nodeenv({
      leetbot_token: "leetbotToken",
      leetbot_username: "fxqelainxq",
      leetbot_bot__timezone: "Europe/Moscow", // UTC+3
      leetbot_bot__dumpFile: "sooomewhere",
      leetbot_bot__dumpCron: "somecron",
      leetbot_bot__admin: "omgWas1Admin"
    });

    const config = loadConfig();

    expect(config.token).toBe("leetbotToken");
    expect(config.username).toBe("fxqelainxq");
    expect(config.bot.timezone).toBe("Europe/Moscow");
    expect(config.bot.dumpFile).toBe("sooomewhere");
    expect(config.bot.dumpCron).toBe("somecron");
    expect(config.bot.admin).toBe("omgWas1Admin");

    restore();
  });

  it("should set sensible default values", () => {
    const config = loadConfig();

    expect(config.token).toBe("");
    expect(config.username).toBe("YeldirsLeetBot");
    expect(config.bot.dumpFile).toBe(path.join(".", "leetbot", "dump.json"));
    expect(config.bot.dumpCron).toBe("* * * * *");
    expect(config.bot.timezone).toBe("Europe/Berlin");
    expect(config.bot.admin).toBe(undefined);
  });
});
