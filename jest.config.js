module.exports = {
  // Set up jest (Enzyme mostly) before each test
  // https://facebook.github.io/jest/docs/en/configuration.html#setuptestframeworkscriptfile-string
  setupTestFrameworkScriptFile: '<rootDir>src/tests.entry.js',

  // Allow jest to understand our code
  // https://facebook.github.io/jest/docs/en/configuration.html#transform-object-string-string
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },

  // https://facebook.github.io/jest/docs/en/configuration.html#globals-object
  globals: {
    __PROD__: true,
  },
};
