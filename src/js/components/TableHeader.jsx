import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TableHeader = ({ className, sort, children, ...others}) => (
  <div
    tabIndex="0"
    role="button"
    className={classnames(className)}
    {...others}>
    {children}
    <span className={classnames('caret', 'ml-2', {
      'caret--up': sort ==='asc',
      'caret--down': sort ==='desc',
    })}/>
  </div>
);

TableHeader.propTypes = {
  sort: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default TableHeader;
