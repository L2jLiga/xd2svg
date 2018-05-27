const path = require('path');
const fs = require('fs');

module.exports = {
  target: 'node',
  entry: './src/cli.ts',
  mode: 'production',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  externals: fs.readdirSync("node_modules")
    .reduce(function(acc, mod) {
      if (mod === ".bin") {
        return acc
      }

      acc[mod] = "commonjs " + mod;
      return acc
    }, {}),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'xd2svg-cli.js',
    path: path.resolve(__dirname, 'dist')
  }
};
