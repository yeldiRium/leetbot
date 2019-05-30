module.exports = {
  'extends': 'standard',
  'plugins': ['jest'],
  'env': {
    'jest/globals': true
  },
  'parser': 'babel-eslint',
  'rules': {
    // TODO: Remove both rules when https://github.com/babel/babel-eslint/issues/530 is fixed
    'template-curly-spacing': 'off',
    'indent': 'off'
  }
}
