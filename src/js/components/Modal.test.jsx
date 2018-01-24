import React from 'react';
import { mount } from 'enzyme';

import Modal from './Modal';

describe('Modal', () => {
  it('renders children properly', () => {
    const modal = mount(<Modal>foo</Modal>);
    expect(modal.find('.modal__body').text()).toBe('foo');
  });

  it('renders a title if passed', () => {
    const modal = mount(<Modal title="foo" />);
    expect(modal.find('h4').text()).toBe('foo');
  });

  it('adds/removes a class on body when mounted/unmounted', () => {
    const modal = mount(<Modal title="foo" />);
    expect(document.body.classList.contains('modal-open')).toBeTruthy();

    modal.unmount();
    expect(document.body.classList.contains('modal-open')).toBeFalsy();
  });

  it('calls onClose() props on button click', () => {
    const onClose = jest.fn();
    const modal = mount(<Modal onClose={onClose} />);

    modal.find('button').simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
