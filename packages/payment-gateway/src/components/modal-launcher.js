import React, { Component } from 'react';
import SimpleModal from './simple-modal';

class SimpleModalLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }
  handleToggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }
  render() {
    const { buttonLabel, children } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <button
          type="button"
          className='modal-button'
          onClick={() => this.handleToggleModal()}
        >
          {buttonLabel}
        </button>
        {showModal &&
          <SimpleModal onCloseRequest={() => this.handleToggleModal()}>
            {children}
          </SimpleModal>}
      </div>
    );
  }
}
export default SimpleModalLauncher;