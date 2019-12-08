const { flaschenpost } = require("flaschenpost");

const leetbot = require("./leetbot");
const { loadConfig } = require("./util/config");
const { validToken } = require("./util");

const logger = flaschenpost.getLogger();
const isProduction = process.env.NODE_ENV === "production";

const version =
  require("../package.json").version + (isProduction ? "" : "-dev");

const config = loadConfig();

if (isProduction) {
  logger.info("Environment.", { environment: "production" });
} else {
  logger.info("Environment.", { environment: "development" });
}

logger.info("Version.", { version });

if (validToken(config.token)) {
  logger.info(`Valid token found for leetbot. Starting...`);
  leetbot(
    config.token,
    {
      ...config.bot,
      version
    },
    {
      username: config.username
    }
  );
} else {
  logger.error(`No valid token provided for leetbot. It will not start!`);
  process.exit(1);
}
