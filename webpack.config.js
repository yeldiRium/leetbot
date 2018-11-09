const path = require('path')

module.exports = {
  entry: {
    main: './index.js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
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
}
