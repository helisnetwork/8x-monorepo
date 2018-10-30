/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';
import PaymentGuide from './payment-guide';

import bus from '../bus';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: 'loading',
      authorized: '',

    };

  }

  componentDidMount() {
    this.initialiseMetaMask();
    this.checkPreviouslyAuthorized();
    this.checkStatus();
    bus.trigger('metamask:approval:requested');
  }

  componentWillUnmount() {
    this.checkPreviouslyAuthorized();
  }

  // Function used to update the state of MetaMask Handler.
  updateStatus(status) {
    this.setState({
      status: status
    });
  };

  // Checks if MetaMask is installed on the browser and calls MetaMask state functions
  initialiseMetaMask() {
    bus.on('metamask:approval:requested', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        try {
          // Request access to expose user accounts
          await ethereum.enable();
      
          bus.trigger('web3:initialised', web3);

        } catch (error) {
          console.log('error');
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
  
        bus.trigger('web3:initialised', web3);
      }
      // Non-dapp browsers, redirect to a prompt to install metamask 
      else {
        this.updateStatus('not installed');
      }
    });
  }

  checkStatus () {
    bus.on('status', (status) => {
      this.setState({
        status: status,
      })
    });
  }

  checkPreviouslyAuthorized () {
    bus.on('user:authorization:true', () => {

      this.setState({
        authorized: true
      });
    });

    bus.trigger('authorization:status');
  }

  render() {
    if(this.state.status === 'unlocked') {
      if(this.state.authorized === true) {
        return (
          <SubscriptionInfo
            status={this.state.status}
          />
        ); 
      } else if(this.state.authorized === false) {
        return (
          <PaymentGuide/>
        );
      } else {
        return null;
      }
    } else {
      return (
        <SubscriptionInfo
          status={this.state.status}
        />
      );
    }
  }
};

export default MetamaskHandler;