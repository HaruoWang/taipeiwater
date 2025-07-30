const path = require('path')
const webpack = require('webpack');

const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },
  devServer: {
    static: path.join(__dirname, 'src')
  },
  plugins: (() => {
    const plugins = [];
    if (isVercel) {
      plugins.push(
        new webpack.DefinePlugin({
          'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
          'process.env.MAP_ID': JSON.stringify(process.env.MAP_ID)
        })
      );
    } else {
      plugins.unshift(new Dotenv());
    }
    plugins.push(new CopyWebpackPlugin({ patterns: [
      { from: 'src', to: '' },
    ]}));
    return plugins;
  })()
};

module.exports = CONFIG;
