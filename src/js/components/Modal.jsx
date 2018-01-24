import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { noop } from '../utils/funcs';

const modalRoot = document.createElement('div');
document.body.appendChild(modalRoot);

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.classList.add('modal');

    this.backdrop = document.createElement('div');
    this.backdrop.classList.add('modal__backdrop');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
    document.body.appendChild(this.backdrop);
    document.body.classList.add('modal-open');
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
    document.body.removeChild(this.backdrop);
    document.body.classList.remove('modal-open');
  }

  render() {
    const { title, onClose, children } = this.props;
    return ReactDOM.createPortal(
      <div className="modal__dialog">
        <div className="modal__content">
          <div className="modal__header">
            <h4>{title}</h4>
            <button type="button" className="modal__close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="modal__body">{children}</div>
        </div>
      </div>,
      this.el
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

Modal.defaultProps = {
  title: '',
  onClose: noop,
};

export default Modal;
