import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Nav = ({ children, className, ...others }) => (
  <div className={classnames('nav', className)} {...others}>
    {children}
  </div>
);

Nav.propTypes = {
  title: PropTypes.string,
};

export default Nav;
