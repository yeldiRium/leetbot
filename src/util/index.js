const R = require("ramda");

const validToken = token => token !== "<TOKEN>" && R.trim(token) !== "";

/**
 * Returns a random value from an array.
 * @param Array array
 * @return {*}
 */
const sample = array => {
  if (array.length === 0) {
    return null;
  }

  const random = Math.floor(Math.random() * array.length);
  return array[random];
};

module.exports = {
  validToken,
  sample
};
