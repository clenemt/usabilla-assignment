import React from 'react';
import { shallow } from 'enzyme';

import Filter from './Filter';

describe('Filter', () => {
  it('calls onClick() with proper value', () => {
    const onClick = jest.fn();
    const filter = shallow(<Filter onClick={onClick} items={['1', '2', '3', '4']} />);

    filter
      .find('.filter__item')
      .first()
      .simulate('click');
    expect(onClick).toHaveBeenLastCalledWith('1');
  });

  it('activates the proper filter', () => {
    const filter = shallow(<Filter isActive={['2']} items={['1', '2', '3', '4']} />);

    const active = filter.find('.filter__item--active');
    expect(active.text()).toEqual('2');
  });
});
