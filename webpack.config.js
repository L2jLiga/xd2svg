const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    'xd2svg-cli': './src/cli.ts',
    'assets/inpage': './src/browser.ts',
  },
  mode: 'production',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  externals: fs.readdirSync('node_modules')
    .reduce(function(acc, mod) {
      if (mod === '.bin') {
        return acc;
      }

      acc[mod] = 'commonjs ' + mod;
      return acc;
    }, {}),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
    new CopyWebpackPlugin([{
      from: './src/assets/inpage.css',
      to: 'assets'
    }])
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
};
