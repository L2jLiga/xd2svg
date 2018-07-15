import { readFileSync } from 'fs';
import { resolve } from 'path';
import { BannerPlugin } from 'webpack';

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'assets/inpage': './src/browser.ts',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    path: resolve(__dirname, 'lib'),
  },
  plugins: [
    new BannerPlugin(
      readFileSync('./LICENSE', 'utf8'),
    ),
    new CopyWebpackPlugin([{
      from: './src/assets/inpage.css',
      to: 'assets',
    }]),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'web',
};
