import axios from 'axios';

import { endpoints } from '../utils/variables';

/**
 * Used to fetch the feedbacks from json.
 */
const feedbacksService = {
  get() {
    return axios.get(endpoints.feedbacks).then((response) => {
      if (response.data?.items) {
        return response.data.items;
      }

      throw new Error('Error while fetching items');
    });
  }
};

export default feedbacksService;
