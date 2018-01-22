import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Feedback = ({ id, rating, comment, browser, browserVersion, device, platform, className, ...others }) => (
  <div className={classnames('d-flex', className)} {...others}>
    <div className="w-25">{rating}</div>
    <div className="w-100">{comment}</div>
    <div className="w-25">
      {browser}<br />
      {browserVersion}
    </div>
    <div className="w-25">{device}</div>
    <div className="w-25">{platform}</div>
  </div>
);

Feedback.propTypes = {
  id: PropTypes.string,
  rating: PropTypes.string,
  comment: PropTypes.string,
  className: PropTypes.string,
  browser: PropTypes.string,
  browserVersion: PropTypes.string,
  device: PropTypes.string,
  platform: PropTypes.string,
};

export default Feedback;
