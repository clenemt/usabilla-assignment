import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Feedback = ({ rating, comment, browser, device, platform, className, ...others }) => (
  <div className={classnames('feedback', className)} {...others}>
    <div className="feedback__cell w-25 t-2">
      {rating && <span className="feedback__rating">{rating}</span>}
    </div>
    <div className="feedback__cell w-50 w-sm-100">{comment}</div>
    <div className="feedback__cell w-25 t-center t-truncate t-pre">{browser}</div>
    <div className="feedback__cell w-25 t-center t-truncate d-none d-sm-block">{device}</div>
    <div className="feedback__cell w-25 t-center t-truncate">{platform}</div>
  </div>
);

Feedback.propTypes = {
  rating: PropTypes.string,
  comment: PropTypes.string,
  className: PropTypes.string,
  browser: PropTypes.string,
  device: PropTypes.string,
  platform: PropTypes.string,
};

export default Feedback;
