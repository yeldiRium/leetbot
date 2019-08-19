const path = require('path')
const packageJson = require('./package.json')

module.exports = (env, options) => ({
  entry: ['babel-polyfill', './index.js'],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /index\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: '<version_number>',
          replace: packageJson.version + ((options.mode === 'production') ? '' : '-dev')
        }
      }
    ]
  },
  resolve: {
    alias: {
      'sandwich-stream$': path.resolve(__dirname, 'node_modules/sandwich-stream/dist/sandwich-stream.js')
    },
    extensions: [ '.jsx', '.js', '.mjs' ]
  }
})
