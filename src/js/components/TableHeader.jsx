import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TableHeader = ({ className, sort, children, ...others }) => (
  <div tabIndex="0" role="button" className={classnames('table-header', className)} {...others}>
    {children}
    <span
      className={classnames('caret', 'table-header__caret', {
        'caret--up': sort === 'asc',
        'caret--down': sort === 'desc',
      })}
    />
  </div>
);

TableHeader.propTypes = {
  sort: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default TableHeader;
