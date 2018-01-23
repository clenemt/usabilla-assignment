/* eslint no-console: off, import/no-extraneous-dependencies: off */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import rules from './rules';

const isDebug = process.env.NODE_ENV !== 'production';
const isVerbose = !!process.env.VERBOSE;

const mode = `mode: ${isDebug ? "'debug'" : "'production'"}`;
console.log(`\n+${'-'.repeat(mode.length + 2)}+\n| ${mode} |\n+${'-'.repeat(mode.length + 2)}+\n`);

const config = {
  // Compile for usage in a browser-like environment
  // https://webpack.js.org/configuration/target/
  target: 'web',

  // Entry point for main js file
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: {
    bundle: ['./src/entry.js'],
  },

  // How and where it should output our bundle
  // https://webpack.js.org/configuration/output/
  output: {
    path: path.resolve(__dirname, '../docs'),
    pathinfo: isVerbose,
    filename: `[name].js?[hash]`,
  },

  module: {
    rules: [rules.js, rules.css, rules.asset],
  },

  // Don't attempt to continue if there are any errors.
  // https://webpack.js.org/configuration/other-options/#bail
  bail: !isDebug,

  // Cache the generated webpack modules and chunks to improve build speed
  // https://webpack.js.org/configuration/other-options/#cache
  cache: isDebug,

  // Precise control of what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: isVerbose ? 'verbose' : isDebug ? 'normal' : 'minimal',

  plugins: [
    // Extract webpack css into its own bundle.css
    // https://webpack.js.org/plugins/extract-text-webpack-plugin/
    new ExtractTextPlugin({
      filename: `[name].css`,
      allChunks: true,
    }),

    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      // Needed for setting webpack in production mode
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __PROD__: !isDebug,
    }),

    ...(isDebug
      ? []
      : [
          // Minimize all JavaScript output of chunks
          // https://github.com/mishoo/UglifyJS2#compressor-options
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false,
            compress: {
              warnings: isVerbose,
            },
          }),
        ]),

    // Scope Hoisting
    // https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b
    ...(isDebug ? [] : [new webpack.optimize.ModuleConcatenationPlugin()]),

    new HtmlWebpackPlugin({
      title: 'Usabilla assignment',
      template: path.resolve(__dirname, '../src/index.html'),
      showErrors: isVerbose,
    }),
  ],

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/
  devtool: isDebug ? 'inline-source-map' : false,

  // These options change how modules are resolved. webpack provides reasonable defaults
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    // So we can avoid `.jsx` & `.js` when importing files
    extensions: ['.js', '.jsx'],
  },

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Config for webpack dev server plugin (small http-server)
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 9000,
    progress: isDebug,
    open: !isDebug,

    // Allow serving routes without going through index.html all the time
    // https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
    historyApiFallback: true,

    // Tell the server where to serve content from
    // https://webpack.js.org/configuration/dev-server/#devserver-contentbase
    contentBase: path.resolve(__dirname, '../docs'),

    // Tell the server to watch the files served
    // https://webpack.js.org/configuration/dev-server/#devserver-watchcontentbase
    watchContentBase: true,

    // Enable gzip compression for everything served
    // https://webpack.js.org/configuration/dev-server/#devserver-compress
    compress: isDebug,

    // https://webpack.js.org/configuration/dev-server/#devserver-clientloglevel
    clientLogLevel: isVerbose ? 'info' : isDebug ? 'warning' : 'error',

    // https://webpack.js.org/configuration/dev-server/#devserver-noinfo-
    noInfo: !isDebug,
  },
};

export default config;
