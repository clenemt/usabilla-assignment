import React from 'react';
import Fuse from 'fuse.js';

import Pager from '../components/Pager';
import Filter from '../components/Filter';
import Feedback from '../components/Feedback';
import TableHeader from '../components/TableHeader';

import store from '../utils/store';
import { capitalize } from '../utils/funcs';

import feedbacksService from '../services/feedbacks';

const sortDirections = ['desc', 'asc', ''];

/**
 * Returns the next sort direction.
 * @param  {String} sortDirection - The current sort direction e.g. 'desc'.
 * @return {String}               - The next sort direction.
 */
const getNextSortDirection = (sortDirection) => {
  const index = sortDirections.indexOf(sortDirection) + 1;
  return index > 2 ? sortDirections[0] : sortDirections[index];
};

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
const normalizeFeedbacks = (feedbacks) =>
  feedbacks.map((feedback) => ({
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
  if (A < B) return -1;
  if (A > B) return 1;
  return 0;
};

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
      this[`onClickSortBy${capitalize(name)}`] = this.sortBy(name, headers[name]);
    });

    this.state = {
      feedbacks: [],
      activeFeedbacks: [],
      pageSize: 10,
      searchBy: '',
    };
  }

  componentDidMount() {
    // Fetch our feedback items on component mount
    feedbacksService.get().then((feedbacks) => {
      const normalizedFeedbacks = normalizeFeedbacks(feedbacks);

      // This will be our default active items
      // usefull for our user to always get back to its initial state
      this.defaultActiveFeedbacks = feedbacks.map((feedback) => feedback.id);

      // Start our search instance only once
      this.fuse = new Fuse(normalizedFeedbacks, {
        keys: ['comment'],
        id: 'id',
        threshold: 0.6,
      });

      // Grab the previous state of the `<FeedbacksPage />`
      const previousRun = store.get('usabilla');

      this.setState(
        {
          feedbacks: normalizedFeedbacks,
          activeFeedbacks: this.defaultActiveFeedbacks,
          page: previousRun?.page || 0,
          sortBy: previousRun?.sortBy || '',
          searchBy: previousRun?.searchBy || '',
          filterBy: previousRun?.filterBy || [],
          sortDirection: previousRun?.sortDirection || '',
        },
        () => this.filterAndSortFeedbacks(this.state.filterBy, this.state.searchBy)
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Will save to localstorage for a better UX when page reloads
    if (
      prevState?.page !== this.state.page ||
      prevState?.sortBy !== this.state.sortBy ||
      prevState?.filterBy !== this.state.filterBy ||
      prevState?.searchBy !== this.state.searchBy ||
      prevState?.sortDirection !== this.state.sortDirection
    ) {
      store.set('usabilla', {
        page: this.state.page,
        sortBy: this.state.sortBy,
        filterBy: this.state.filterBy,
        searchBy: this.state.searchBy,
        sortDirection: this.state.sortDirection,
      });
    }
  }

  /**
   * Triggered when user click any rating filter.
   * @param {string} value - The rating value.
   */
  onFilter = (value) => {
    const { searchBy, filterBy } = this.state;
    const newFilterBy = filterBy.slice(0);
    const index = filterBy.indexOf(value);

    if (index !== -1) {
      newFilterBy.splice(index, 1);
    } else {
      newFilterBy.push(value);
    }

    this.filterAndSortFeedbacks(newFilterBy, searchBy);
  };

  /**
   * Triggered when user type inside search input.
   * @param {Object} event - React SyntheticEvent.
   */
  onSearch = (event) => {
    const { filterBy } = this.state;
    this.filterAndSortFeedbacks(filterBy, event.target.value);
  };

  /**
   * Will first filter by any search query, then filter by rating
   * and finally sort all feedback items.
   * @param  {String[]} filterBy - Same as `state.filterBy`.
   * @param  {String}   searchBy - Same as `state.searchBy`.
   */
  filterAndSortFeedbacks(filterBy, searchBy) {
    const { sortBy, sortDirection, feedbacks, page, pageSize } = this.state;
    let activeFeedbacks;

    // First filter by search
    activeFeedbacks = searchBy ? this.fuse.search(searchBy) : this.defaultActiveFeedbacks;

    // Then by rating if needed
    if (filterBy.length) {
      activeFeedbacks = activeFeedbacks
        .map((activeFeedback) => feedbacks.find((feedback) => feedback.id === activeFeedback))
        .filter((feedback) => filterBy.indexOf(feedback.rating) !== -1)
        .map((feedback) => feedback.id);
    }

    // And finally sort it if needed
    if (sortBy) {
      activeFeedbacks = this.sortActiveFeedbacks(headers[sortBy], sortDirection, activeFeedbacks);
    }

    // Try to keep current page if possible
    const numberOfPages = Math.ceil(activeFeedbacks.length / pageSize);
    const newPage = Math.max(0, page > numberOfPages - 1 ? numberOfPages - 1 : page);

    this.setState({
      page: newPage,
      filterBy,
      searchBy,
      activeFeedbacks,
    });
  }

  /**
   * Returns a function for toggling the table sort based on the header clicked.
   * @param  {String} predicate - The type of sort e.g. 'rating'
   * @param  {Function}    func - The sort function.
   * @return {Function}         - The bound table sort function.
   */
  sortBy = (predicate, func) => () => {
    let sortDirection = sortDirections[0];
    let activeFeedbacks;

    // If already sorting by predicate get the next sort direction
    if (this.state.sortBy === predicate) {
      sortDirection = getNextSortDirection(this.state.sortDirection);
    }

    if (!sortDirection) {
      activeFeedbacks = this.defaultActiveFeedbacks.filter(
        (defaultActiveFeedback) => this.state.activeFeedbacks.indexOf(defaultActiveFeedback) !== -1
      );
    } else {
      activeFeedbacks = this.sortActiveFeedbacks(func, sortDirection, this.state.activeFeedbacks);
    }

    this.setState({
      sortDirection,
      activeFeedbacks,
      sortBy: predicate,
    });
  };

  /**
   * Sort the currently active feedbacks.
   * @param  {Function}            func - The sort function.
   * @param  {String}     sortDirection - The direction of the sorting e.g. 'asc'
   * @param  {Object[]} activeFeedbacks - The active feedbacks.
   * @return {Object[]}                 - The sorted active feedbacks.
   */
  sortActiveFeedbacks = (func, sortDirection, activeFeedbacks) => {
    if (!sortDirection) return activeFeedbacks;

    const sortedActiveFeedbacks = activeFeedbacks
      .map((activeFeedback) =>
        this.state.feedbacks.find((feedback) => feedback.id === activeFeedback)
      )
      .sort(func)
      .map((feedback) => feedback.id);

    if (sortDirection === 'desc') {
      sortedActiveFeedbacks.reverse();
    }

    return sortedActiveFeedbacks;
  };

  /**
   * Render the `<Pager />`.
   * @return {Node[]}
   */
  renderPagination() {
    const { page, pageSize, activeFeedbacks } = this.state;
    const numberOfPages = Math.ceil(activeFeedbacks.length / pageSize);

    return Array.from(Array(numberOfPages)).map((a, index) => (
      <Pager
        key={index}
        value={`${index}`}
        isActive={page === index}
        onClick={() => this.setState({ page: index })}
      />
    ));
  }

  /**
   * Render the `<TableHeader />`.
   * @return {Node[]}
   */
  renderHeaders() {
    return Object.keys(headers).map((name, index) => (
      <TableHeader
        key={index}
        className={name === 'comment' ? 'w-100' : 'w-25'}
        sort={name === this.state.sortBy ? this.state.sortDirection : ''}
        onClick={this[`onClickSortBy${capitalize(name)}`]}
      >
        {capitalize(name)}
      </TableHeader>
    ));
  }

  /**
   * Only render the currently paginated `<Feedback />`.
   * @return {Node[]}
   */
  renderPaginatedFeedbacks() {
    const { page, pageSize, activeFeedbacks, feedbacks } = this.state;
    const paginatedFeedbacks = [];

    for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
      const feedback = feedbacks.find((feedback) => activeFeedbacks[i] === feedback.id);
      if (!feedback) continue;

      const { id, ...props } = feedback;
      paginatedFeedbacks.push(<Feedback key={id} {...props} />);
    }

    return paginatedFeedbacks;
  }

  render() {
    const { searchBy, filterBy } = this.state;
    return (
      <>
        <div className="d-flex">
          <input
            type="text"
            placeholder="Search feedbacks"
            onChange={this.onSearch}
            value={searchBy}
          />
          <Filter onClick={this.onFilter} items={['1', '2', '3', '4', '5']} isActive={filterBy} />
        </div>
        <div className="d-flex">{this.renderPagination()}</div>
        <div className="d-flex">{this.renderHeaders()}</div>
        <div>{this.renderPaginatedFeedbacks()}</div>
      </>
    );
  }
}

export default FeedbackList;
