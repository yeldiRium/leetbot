const { dirname } = require("path");
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require("fs");

const { createStore } = require("redux");
const { migrations } = require("@yeldirium/redux-migrations");

const migrationDefinitions = require("./migrations");

/**
 * Load a startup state = require(a dump file, if it exists.)
 * Otherwise return undefined.
 *
 * @param String fileName
 * @return {*} state
 */
const loadState = dumpFile => {
  if (existsSync(dumpFile)) {
    console.info(`loading state from ${dumpFile}`);
    return JSON.parse(readFileSync(dumpFile));
  }
  console.info(`${dumpFile} doesn't exist; starting with empty state`);
  return undefined;
};

/**
 * Dump a given state object into a dump file.
 * @param String dumpFile
 * @param {*} state
 */
const dumpState = (dumpFile, state) => {
  mkdirSync(dirname(dumpFile), { recursive: true });
  writeFileSync(dumpFile, JSON.stringify(state), { flag: "w+" });
};

/**
 * Creates a redux store, optionally hydrating = require(a dumpfile and running)
 * migrations.
 * @param {Function} rootReducer
 * @param {String} dumpFile Path to dumpFile.
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
