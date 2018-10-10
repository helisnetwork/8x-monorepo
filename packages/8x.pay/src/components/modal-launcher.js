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
    this.initialiseWeb3();
  }

  listenToggleModal() {
    bus.on('modal:show',(status) => {
      this.setState({
        showModal: status
      });
    });
  }

  initialiseWeb3() {
    window.addEventListener('load', function() {

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);

      } else {
        console.log('No web3? You should consider trying MetaMask!');
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8080'));
      }
      // Now you can start your app & access web3 freely:
      bus.trigger('web3:initialised', web3);
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