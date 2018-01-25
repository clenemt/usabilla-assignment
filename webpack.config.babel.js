/* eslint no-console: off, import/no-extraneous-dependencies: off */

import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpackBundleAnalyzer from 'webpack-bundle-analyzer';

const config = (env) => {
  const isDev = !env?.prod;
  const isVerbose = env?.verbose;
  const isAnalyze = env?.analyze;

  const js = {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /(node_modules|bower_components)/,
    query: {
      // Faster build thanks to caching
      // https://github.com/babel/babel-loader#options
      cacheDirectory: isDev,

      // The `.babelrc` is only used by babel to transpile the webpack config from es6 to es5
      // Why? It would not work with the `.babelrc` env option because the "prod" would have
      // `"modules": false` to enable tree shaking which will break the webapck config (import statements not transpiled)
      // https://babeljs.io/docs/usage/options/
      babelrc: false,

      presets: [
        // A Babel preset that can automatically determine the Babel plugins and polyfills
        // https://github.com/babel/babel/tree/master/packages/babel-preset-env
        [
          '@babel/preset-env',
          {
            modules: isDev ? 'commonjs' : false,
            useBuiltIns: isDev ? false : 'usage',
          },
        ],

        // Experimental ECMAScript proposals
        // https://babeljs.io/docs/plugins/preset-stage-2/
        '@babel/preset-stage-2',

        // JSX
        // https://babeljs.io/docs/plugins/preset-react/
        '@babel/preset-react',
      ],

      plugins: [
        // Allows for optional chaining through `?.`
        // https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-optional-chaining
        '@babel/plugin-proposal-optional-chaining',
      ],
    },
  };

  // Small helper to switch between inline css and
  // extract css to bundle. Enables HMR for css.
  const extractStyles = (loaders) => {
    if (!isDev) {
      return ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: loaders,
      });
    }
    return ['style-loader', ...loaders];
  };

  const css = {
    test: /\.(css|scss)$/,
    use: extractStyles([
      {
        // CSS Loader https://github.com/webpack/css-loader
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: isDev,
          // CSS Nano http://cssnano.co/options/
          minimize: !isDev,
        },
      },
      {
        // PostCSS Loader https://github.com/postcss/postcss-loader
        loader: 'postcss-loader',
        options: {
          sourceMap: isDev,
          plugins: [
            // Used to resolve imports
            // https://github.com/postcss/postcss-import
            postcssImport(),
            // Add vendor prefixes to CSS rules using values from caniuse.com
            // https://github.com/postcss/autoprefixer
            autoprefixer(),
          ],
        },
      },
      {
        // Sass Loader https://github.com/webpack-contrib/sass-loader
        loader: 'sass-loader',
        options: {
          sourceMap: isDev,
        },
      },
    ]),
  };

  const asset = {
    test: /\.(jpg|jpeg|gif|png|svg|woff|woff2)$/,
    // File loader https://github.com/webpack-contrib/file-loader
    loader: 'file-loader',
    options: {
      name: 'assets/img/[name].[ext]?[hash]',
    },
  };

  return {
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
      path: path.resolve(__dirname, 'docs'),
      filename: `[name].js?[hash]`,
    },

    module: {
      rules: [js, css, asset],
    },

    // Don't attempt to continue if there are any errors.
    // https://webpack.js.org/configuration/other-options/#bail
    bail: !isDev,

    // Cache the generated webpack modules and chunks to improve build speed
    // https://webpack.js.org/configuration/other-options/#cache
    cache: isDev,

    // Precise control of what bundle information gets displayed
    // https://webpack.js.org/configuration/stats/
    stats: isVerbose ? 'verbose' : 'normal',

    plugins: [
      // Extract webpack css into its own bundle.css
      // https://webpack.js.org/plugins/extract-text-webpack-plugin/
      new ExtractTextPlugin({
        filename: `[name].css?[contenthash]`,
        allChunks: true,
      }),

      // Define free variables
      // https://webpack.js.org/plugins/define-plugin/
      new webpack.DefinePlugin({
        __PROD__: !isDev,
      }),

      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      ...(isDev
        ? []
        : [
            new webpack.optimize.UglifyJsPlugin({
              sourceMap: true,
              comments: false,
              compress: {
                warnings: isVerbose,
              },
            }),
          ]),

      // Simplifies creation of HTML files to serve your webpack bundles
      // https://github.com/jantimon/html-webpack-plugin
      new HtmlWebpackPlugin({
        title: 'Usabilla assignment',
        template: path.resolve(__dirname, 'src/index.html'),
      }),

      // Avoid rebuilding bundles because of new module names
      // https://webpack.js.org/guides/caching/
      ...(isDev ? [] : [new webpack.HashedModuleIdsPlugin()]),

      // Move all `node_modules` inside vendor bundle
      // https://webpack.js.org/guides/caching/
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1,
      }),

      // Avoid invalidating cache if only webpack files changed
      // https://webpack.js.org/guides/caching/
      new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),

      // Scope Hoisting
      // https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b
      ...(isDev || isAnalyze ? [] : [new webpack.optimize.ModuleConcatenationPlugin()]),

      // To have HMR running
      // https://github.com/webpack/webpack/issues/1151
      ...(isDev ? [new webpack.HotModuleReplacementPlugin()] : []),

      // Enable analyzing bundles
      // https://github.com/webpack-contrib/webpack-bundle-analyzer
      ...(isAnalyze ? [new webpackBundleAnalyzer.BundleAnalyzerPlugin()] : []),
    ],

    // Choose a developer tool to enhance debugging
    // https://webpack.js.org/configuration/devtool/
    devtool: isDev ? 'inline-source-map' : false,

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
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },

    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: isDev ? false : 'warning',
    },

    // Config for webpack dev server plugin (small http-server)
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
      port: 9000,

      // Output running progress to console
      // https://webpack.js.org/configuration/dev-server/#devserver-progress-cli-only
      progress: isDev,

      // Shows a full-screen overlay in the browser when there are compiler errors or warnings.
      // https://webpack.js.org/configuration/dev-server/#devserver-overlay
      overlay: true,

      // When open is enabled, the dev server will open the browser
      // https://webpack.js.org/configuration/dev-server/#devserver-open
      open: isDev,

      // Webpack's Hot Module Replacement feature
      // https://webpack.js.org/configuration/dev-server/#devserver-hot
      hot: isDev,

      // Allow serving routes without going through index.html all the time
      // https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
      historyApiFallback: true,

      // Tell the server where to serve content from
      // https://webpack.js.org/configuration/dev-server/#devserver-contentbase
      contentBase: path.resolve(__dirname, 'docs'),

      // Tell the server to watch the files served
      // https://webpack.js.org/configuration/dev-server/#devserver-watchcontentbase
      watchContentBase: true,

      // Enable gzip compression for everything served
      // https://webpack.js.org/configuration/dev-server/#devserver-compress
      compress: true,

      // Will show in console when HMR kicks in if enabled
      // https://webpack.js.org/configuration/dev-server/#devserver-clientloglevel
      clientLogLevel: isVerbose ? 'info' : 'none',

      // No need for webpack bundle info in dev mode
      // https://webpack.js.org/configuration/dev-server/#devserver-noinfo-
      noInfo: !isVerbose,
    },
  };
};

export default config;
