import React from 'react';
import { shallow } from 'enzyme';

import TableHeader from './TableHeader';

describe('TableHeader', () => {
  it('shows a caret when sort is passed', () => {
    const tableHeader = shallow(<TableHeader sort="asc" />);

    const caret = tableHeader.find('.caret');
    expect(caret).toHaveLength(1);
  });

  it('shows a caret with direction matching the sort', () => {
    const tableHeader = shallow(<TableHeader sort="asc" />);

    let caret = tableHeader.find('.caret--up');
    expect(caret).toHaveLength(1);

    tableHeader.setProps({ sort: 'desc' });

    caret = tableHeader.find('.caret--down');
    expect(caret).toHaveLength(1);
  });
});
