import React from 'react';
import Fuse from 'fuse.js';

import Pager from '../components/Pager';
import Feedback from '../components/Feedback';
import TableHeader from '../components/TableHeader';

import store from '../utils/store';
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
  rating: `${feedback.rating}`,
  comment: feedback.comment,
  browser: feedback.computed_browser?.Browser,
  browserVersion: feedback.computed_browser?.Version,
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
  rating: sortByPredicate('rating'),
  comment: sortByPredicate('comment'),
  browser: sortByPredicate('browser'),
  device: sortByPredicate('device'),
  platform: sortByPredicate('platform'),
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
      pageSize: 10,
    };
  }

  componentDidMount() {
    // Fetch our feedback items on component mount
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

        // Grab the previous state of the `<FeedbacksPage />`
        const previousRun = store.get('usabilla');

        this.setState({
          feedbacks: normalizedFeedbacks,
          activeFeedbacks: this.defaultActiveFeedbacks,
          page: previousRun?.page || 0,
          sortBy: previousRun?.sortBy || '',
          sortDirection: previousRun?.sortDirection || '',
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // Will save to localstorage for a better UX when page reloads
    if (prevState?.page !== this.state.page || prevState?.sortBy !== this.state.sortBy || prevState?.sortDirection !== this.state.sortDirection) {
      store.set('usabilla', {
        page: this.state.page,
        sortBy: this.state.sortBy,
        sortDirection: this.state.sortDirection,
      });
    }
  }

  /**
   * Search the `activeFeedbacks` while respecting the active sort.
   * @param {Object} event - React SyntheticEvent.
   */
  onSearch = (event) => {
    const {sortBy, sortDirection} = this.state;
    let activeFeedbacks = event.target.value ? this.fuse.search(event.target.value) : this.defaultActiveFeedbacks;

    if (sortBy){
      activeFeedbacks = this.sortActiveFeedbacks(headers[sortBy], sortDirection, activeFeedbacks);
    }

    this.setState({
      page: 0,
      activeFeedbacks,
    });
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

  /**
   * Render the `<Pager />`.
   * @return {Node[]}
   */
  renderPagination() {
    const { page, pageSize, activeFeedbacks } = this.state;
    const numberOfPages = Math.ceil(activeFeedbacks.length / pageSize);

    return Array.from(Array(numberOfPages)).map((a, index) =>
      <Pager
        key={index}
        value={`${index}`}
        isActive={page === index}
        onClick={() => this.setState({ page: index })}
      />
    );
  }

  /**
   * Render the `<TableHeader />`.
   * @return {Node[]}
   */
  renderHeaders() {
    return Object.keys(headers).map((name, index) =>
      <TableHeader
        key={index}
        className={name === 'comment' ? 'w-100': 'w-25'}
        sort={name === this.state.sortBy ? this.state.sortDirection : ''}
        onClick={this[`toggleSortBy${capitalize(name)}`]}>
        {capitalize(name)}
      </TableHeader>
    )
  }

  /**
   * Only render the currently paginated `<Feedback />`.
   * @return {Node[]}
   */
  renderPaginatedFeedbacks() {
    const { page, pageSize, activeFeedbacks, feedbacks } = this.state;
    const paginatedFeedbacks = [];

    for(let i = page * pageSize; i < (page + 1) * pageSize; i++) {
      const feedback = feedbacks.find((feedback) => activeFeedbacks[i] === feedback.id);
      if (!feedback) continue;

      const {id, ...props} = feedback;
      paginatedFeedbacks.push(
        <Feedback key={id} {...props} />
      )
    }

    return paginatedFeedbacks;
  }

  render() {
    return (
      <>
        <input type="text" placeholder="Search feedbacks" onChange={this.onSearch}/>

        <div className="d-flex">
          {this.renderPagination()}
        </div>

        <div className="d-flex">
          {this.renderHeaders()}
        </div>

        <div>
          {this.renderPaginatedFeedbacks()}
        </div>
      </>
    );
  }
}

export default FeedbackList;
