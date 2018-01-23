/**
 * Hold some common variables.
 * Makes it easy to refactor.
 */

const baseUrl = __PROD__ ? 'https://static.usabilla.com/' : '/assets/';

export const endpoints = {
  feedbacks: `${baseUrl}recruitment/apidemo.json`,
};

export const assetsUrl = __PROD__
  ? 'https://clenemt.github.io/usabilla-assignment/assets/'
  : '/assets/';
