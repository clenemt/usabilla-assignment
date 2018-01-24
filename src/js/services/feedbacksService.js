import axios from 'axios';

import endpoints from '../utils/variables';

/**
 * Used to fetch the feedbacks from json.
 */
const feedbacks = {
  get() {
    // Wrap it with a promise so that we have at least one Promise inside
    // our project and the Promise polyfill from @babel/polyfill kicks in
    return new Promise((resolve, reject) => {
      axios.get(endpoints.feedbacks).then((response) => {
        if (response.data?.items) {
          resolve(response.data.items);
        }

        reject(new Error('Error while fetching items'));
      });
    });
  },
};

export default feedbacks;
