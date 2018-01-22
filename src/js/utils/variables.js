/**
 * Hold some common variables.
 * Makes it easy to refactor.
 */

export const baseUrl = __PROD__ ? 'https://static.usabilla.com/' : '/assets/';
const addBaseUrl = (url) => `${baseUrl}${url}`;

export const endpoints = {
  feedbacks: addBaseUrl('recruitment/apidemo.json'),
};
