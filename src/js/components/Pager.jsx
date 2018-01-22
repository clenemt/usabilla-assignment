import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Pager = ({ value, isActive, className, ...others }) => (
  <div
    tabIndex="0"
    role="button"
    className={classnames(className, isActive ? 't-bold' : '')}
    {...others}
  >
    {value}
  </div>
);

Pager.propTypes = {
  value: PropTypes.string,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default Pager;
