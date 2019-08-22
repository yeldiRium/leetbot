const leetbot = require("./leetbot");
const { loadConfig } = require("./util/config");
const { validToken } = require("./util");

const isProduction = process.env.NODE_ENV === "production";

// This will be replaced by webpack.
const version =
  require("../package.json").version + (isProduction ? "" : "-dev");

const config = loadConfig();

if (isProduction) {
  console.log("Production environment detected.");
} else {
  console.log("Development environment detected.");
}
console.log(`Running version ${version}`);

if (validToken(config.token)) {
  console.log(`Valid token found for leetbot. Starting...`);
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
  console.error(`No valid token provided for leetbot. It will not start!`);
  process.exit(1);
}
