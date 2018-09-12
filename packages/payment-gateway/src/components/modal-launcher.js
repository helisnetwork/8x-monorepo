import React, { Component } from 'react';
import SimpleModal from './simple-modal';

import bus from '../bus';

class SimpleModalLauncher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };

    this.listenToggleModal();
  }

  listenToggleModal() {
    console.log('called');
    bus.on('modal:show',(status) => {
      this.setState({
        showModal: status
      });
    });
  }

  render() {
    const { buttonLabel, children } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <button
          type="button"
          className='modal-button'
          onClick={() => {
            console.log('clicked');
            bus.trigger('modal:show', true);
          }}
        >
          {buttonLabel}
        </button>
        {showModal &&
          <SimpleModal>
            {children}
          </SimpleModal>}
      </div>
    );
  }
}
export default SimpleModalLauncher;