import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from '../utils/funcs';

const Filter = ({ isActive, items, className, onClick, ...others }) => (
  <div className={classnames('d-flex', className)} {...others}>
    {items.map((item, index) => (
      <div
        key={item?.id || index}
        role="button"
        tabIndex="0"
        onClick={() => onClick(item?.value || item)}
        className={isActive.indexOf(item?.id || item?.value || item) !== -1 ? 't-bold' : ''}
      >
        {item?.label || item?.value || item}
      </div>
    ))}
  </div>
);

Filter.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.PropTypes.arrayOf(PropTypes.object),
    PropTypes.PropTypes.arrayOf(PropTypes.string),
  ]),
  isActive: PropTypes.PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Filter.defaultProps = {
  items: [],
  isActive: [],
  onClick: noop,
  className: '',
};

export default Filter;
