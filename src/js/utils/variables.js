/**
 * Hold some common variables.
 * Makes it easy to refactor.
 */

const baseEndpointsUrl = __PROD__ ? 'https://static.usabilla.com/' : '/data/';

export default {
  feedbacks: `${baseEndpointsUrl}recruitment/apidemo.json`,
};
