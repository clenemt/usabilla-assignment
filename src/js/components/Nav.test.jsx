import React from 'react';
import { shallow } from 'enzyme';

import Nav from './Nav';

describe('Filter', () => {
  it('render a Nav and its children', () => {
    const nav = shallow(
      <Nav>
        <span className="marker">foo</span>
      </Nav>
    );

    nav.find('.marker');
    expect(nav.find('.marker')).toHaveLength(1);
  });
});
