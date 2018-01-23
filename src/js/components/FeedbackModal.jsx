import React from 'react';
import PropTypes from 'prop-types';

import Modal from './Modal';

import { noop } from '../utils/funcs';

const FeedbackModal = ({ onClose, feedback, ...others }) => (
  <Modal
    title={`Feedback from ${feedback.browser} on ${feedback.platform}`}
    onClose={onClose}
    {...others}
  >
    {feedback.comment && (
      <>
        <h4>Comment:</h4>
        <p>{feedback.comment}</p>
      </>
    )}
    {feedback.images?.screenshot?.url && (
      <>
        <h4>Screenshot:</h4>
        <img className="img--fluid" src={feedback.images.screenshot.url} alt="screenshot" />
      </>
    )}
  </Modal>
);

FeedbackModal.propTypes = {
  feedback: PropTypes.shape({
    id: PropTypes.string,
    rating: PropTypes.string,
    comment: PropTypes.string,
    className: PropTypes.string,
    browser: PropTypes.string,
    device: PropTypes.string,
    platform: PropTypes.string,
    images: PropTypes.object,
  }),
  onClose: PropTypes.func,
};

FeedbackModal.defaultProps = {
  feedback: {},
  onClose: noop,
};

export default FeedbackModal;
