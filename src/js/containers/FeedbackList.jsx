import React from 'react';
import Fuse from 'fuse.js';

import { capitalize } from '../utils/funcs';
import feedbacksService from '../services/feedbacks';


const sortDirections = [ 'desc', 'asc', '' ];

/**
 * Returns the next sort direction.
 * @param  {String} sortDirection - The current sort direction e.g. 'desc'.
 * @return {String}               - The next sort direction.
 */
const getNextSortDirection = (sortDirection) => {
  const index = sortDirections.indexOf(sortDirection) + 1;
  return index > 2 ? sortDirections[0] : sortDirections[index];
}

/**
 * Returns whether it is a `Desktop` or `Mobile` device.
 */
const normalizeDevice = (feedback) => {
  const platform = feedback.browser?.platform || feedback.computed_browser?.Platform;
  return /win|mac/i.test(platform) ? 'Desktop' : 'Mobile';
};

/**
 * Only pluck what we need for our state.
 */
const normalizeFeedbacks = (feedbacks) => feedbacks.map((feedback) => ({
  id: feedback.id,
  rating: feedback.rating,
  comment: feedback.comment,
  browser: feedback.computed_browser?.Browser,
  version: feedback.computed_browser?.Version,
  platform: feedback.computed_browser?.Platform,
  device: normalizeDevice(feedback),
}));

/**
 * Returns an alphabetical sort function based on the predicate.
 * @param  {String} predicate - The key name.
 * @return {Function}         - The sort function.
 */
const sortByPredicate = (predicate) => (a, b) => {
  const A = a[predicate].toUpperCase();
  const B = b[predicate].toUpperCase();
  if(A < B) return -1;
  if(A > B) return 1;
  return 0;
}

/**
 * Common sort functions based on headers.
 */
const headers = {
  rating: (a, b) => a.rating - b.rating,
  browser: sortByPredicate('browser'),
  comment: sortByPredicate('comment'),
  platform: sortByPredicate('platform'),
  device: sortByPredicate('device'),
};

class FeedbackList extends React.Component {

  constructor(props) {
    super(props);

    // Create a method for all type of sort once
    Object.keys(headers).forEach((name) => {
      this[`toggleSortBy${capitalize(name)}`] = this.toggleSortBy(name, headers[name]);
    });

    this.state = {
      feedbacks: [],
      activeFeedbacks: [],
      page: 0,
      pageSize: 10,
      sortBy: '',
      sortDirection: ''
    };
  }

  /**
   * Fetch our feedback items on component mount.
   */
  componentDidMount() {
    feedbacksService.get()
      .then((feedbacks) => {
        const normalizedFeedbacks = normalizeFeedbacks(feedbacks);

        this.defaultActiveFeedbacks = feedbacks.map((feedback) => feedback.id);

        // Start our search instance only once
        this.fuse = new Fuse(normalizedFeedbacks, {
          keys: ['comment'],
          id: 'id',
          threshold: 0.6,
        });

        this.setState({
          feedbacks: normalizedFeedbacks,
          activeFeedbacks: this.defaultActiveFeedbacks,
        });
      });
  }

  /**
   * Search the `activeFeedbacks` while respecting the active sort.
   * @param {Object} event - React SyntheticEvent.
   */
  onSearch = (event) => {
    let activeFeedbacks = event.target.value ? this.fuse.search(event.target.value) : this.defaultActiveFeedbacks;

    if (this.state.sortBy){
      activeFeedbacks = this.sortActiveFeedbacks(headers[this.state.sortBy], this.state.sortDirection, activeFeedbacks);
    }

    this.setState({ activeFeedbacks });
  }

  /**
   * Returns a function for toggling the table sort based on the header clicked.
   * @param  {String} predicate - The type of sort e.g. 'rating'
   * @param  {Function}    func - The sort function.
   * @return {Function}         - The bound table sort function.
   */
  toggleSortBy = (predicate, func) => () => {
    let sortDirection = sortDirections[0];

    // If already sorting by predicate get the next sort direction
    if (this.state.sortBy === predicate) {
      sortDirection = getNextSortDirection(this.state.sortDirection);
    }

    const activeFeedbacks = this.sortActiveFeedbacks(func, sortDirection);

    this.setState({
      sortDirection,
      activeFeedbacks,
      sortBy: predicate,
    });
  }

  /**
   * Sort the currently active feedbacks.
   * @param  {Function}        func - The sort function.
   * @param  {String} sortDirection - The direction of the sorting e.g. 'asc'
   * @param  {Object[]} [activeFeedbacks=this.state.activeFeedbacks] - The active feedbacks (optional).
   * @return {Object[]}             - The sorted active feedbacks.
   */
  sortActiveFeedbacks = (func, sortDirection, activeFeedbacks = this.state.activeFeedbacks) => {
    let nextActiveFeedbacks;

    if (!sortDirection) {
      nextActiveFeedbacks = this.defaultActiveFeedbacks.filter((defaultActiveFeedback) => activeFeedbacks.indexOf(defaultActiveFeedback) !== -1);
    } else {
      const feedbacks = activeFeedbacks.map((activeFeedback) => this.state.feedbacks.find((feedback) => feedback.id === activeFeedback));
      nextActiveFeedbacks = feedbacks.sort(func).map((feedback) => feedback.id);
    }

    if (sortDirection === 'desc') {
      nextActiveFeedbacks.reverse();
    }

    return nextActiveFeedbacks;
  }

  renderPagination() {
    const { page, pageSize, activeFeedbacks } = this.state;
    const numberOfPages = Math.ceil(activeFeedbacks.length / pageSize);

    return Array.from(Array(numberOfPages)).map((a, index) =>
      <div
        key={index}
        tabIndex="0"
        role="button"
        onClick={() => this.setState({ page: index })}
        className={page === index ? 'active': ''}>
        {index}
      </div>
    );
  }

  renderPaginatedFeedbacks() {
    const { page, pageSize, activeFeedbacks, feedbacks } = this.state;
    const paginatedFeedbacks = [];

    for(let i = page * pageSize; i < (page + 1) * pageSize; i++) {
      const feedback = feedbacks.find((feedback) => activeFeedbacks[i] === feedback.id);
      if (!feedback) continue;

      paginatedFeedbacks.push(
        <div key={feedback.id} className="d-flex">
          <div className="w-25">{feedback.rating}</div>
          <div className="w-100">{feedback.comment}</div>
          <div className="w-25">
            {feedback.browser}
            {feedback.version}
          </div>
          <div className="w-25">{feedback.device}</div>
          <div className="w-25">{feedback.platform}</div>
        </div>
      )
    }

    return paginatedFeedbacks;
  }

  render() {
    return (
      <>
        <input type="text" placeholder="Search feedback" onChange={this.onSearch}/>
        <div className="d-flex">{this.renderPagination()}</div>

        <div className="d-flex">
          <div className="w-25" onClick={this.toggleSortByRating} tabIndex="0" role="button">Rating</div>
          <div className="w-100" onClick={this.toggleSortByComment} tabIndex="0" role="button">Comment</div>
          <div className="w-25" onClick={this.toggleSortByBrowser} tabIndex="0" role="button">Browser</div>
          <div className="w-25" onClick={this.toggleSortByDevice} tabIndex="0" role="button">Device</div>
          <div className="w-25" onClick={this.toggleSortByPlatform} tabIndex="0" role="button">Platform</div>
        </div>

        <div>{this.renderPaginatedFeedbacks()}</div>
      </>
    );
  }
}

export default FeedbackList;
