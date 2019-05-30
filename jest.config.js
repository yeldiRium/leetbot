module.exports = {
  'setupFilesAfterEnv': ['jest-extended'],
  'collectCoverage': true,
  'collectCoverageFrom': [
    'leetbot/**/*.js',
    'util/**/*.js'
  ],
  'coverageReporters': [
    'html',
    'lcov'
  ],
  'setupFiles': ['<rootDir>/node_modules/babel-polyfill/dist/polyfill.js'],
  'transform': {
    '^.+\\.jsx?$': 'babel-jest'
  }
}
