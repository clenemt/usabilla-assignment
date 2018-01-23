import React from 'react';
import { shallow } from 'enzyme';

import Pager from './Pager';

describe('Pager', () => {
  it('activates the pager filter', () => {
    const pager = shallow(<Pager isActive />);

    const active = pager.find('.pager--active');
    expect(active).toHaveLength(1);
  });
});
