const { dirname } = require("path");
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require("fs");

const { createStore } = require("redux");
const { flaschenpost } = require("flaschenpost");
const { migrations } = require("@yeldirium/redux-migrations");

const migrationDefinitions = require("./migrations");

const logger = flaschenpost.getLogger();

/**
 * Load a startup state from a dump file, if it exists.
 * Otherwise return undefined.
 */
const loadState = dumpFile => {
  if (existsSync(dumpFile)) {
    logger.info("Loading state.", { dumpFile });
    return JSON.parse(readFileSync(dumpFile));
  }
  logger.warn("Dump file doesn't exist; Starting with empty state");
  return undefined;
};

/**
 * Dump a given state object into a dump file.
 */
const dumpState = (dumpFile, state) => {
  mkdirSync(dirname(dumpFile), { recursive: true });
  writeFileSync(dumpFile, JSON.stringify(state), { flag: "w+" });
};

/**
 * Creates a redux store, optionally hydrating from a dumpfile and running
 * migrations.
 */
const createStoreFromState = (rootReducer, dumpFile) => {
  const previousState = loadState(dumpFile);
  try {
    const store = createStore(
      rootReducer,
      previousState,
      migrations(migrationDefinitions)
    );
    return store;
  } catch (error) {
    return createStore(rootReducer);
  }
};

module.exports = {
  createStoreFromState,
  dumpState,
  loadState
};
