import React, { Component } from 'react';
import isNil from 'lodash/fp/isNil';

import bus from '../bus';

class SimpleModal extends Component {

  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp, false);
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  handleKeyUp(e) {
    const keys = {
      27: () => {
        e.preventDefault();
        bus.trigger('modal:show', false);
        window.removeEventListener('keyup', this.handleKeyUp, false);
      },
    };
    if (keys[e.keyCode]) { keys[e.keyCode](); }
  }

  handleOutsideClick(e) {
    e.preventDefault();
    if (isNil(this.modal)) {
      if (!this.modal.contains(e.target)) {
        bus.trigger('modal:show', false);
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    }
  }

  render () {
    const { children } = this.props;

    return (
      <div className='modal-overlay'>
        <div
          className='modal'
          ref={node => (this.modal = node)}
        >
          <div className='modal-content'>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
export default SimpleModal;