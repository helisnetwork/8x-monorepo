/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';
import bus from '../bus';
import { MockTokenAbi, ConfigAddresses } from '@8xprotocol/artifacts';
import { getToken } from '../constants';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: 'loading',
      address: '',
      ethBalance: '',
      daiBalance: ''
    };
    this.initialiseMetaMask();
    this.userInfoListener();
  }

  componentDidMount() {
    bus.trigger('metamask:approval:requested');
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
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          bus.trigger('web3:initialised', web3);
        } catch (error) {
          console.log('error');
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        bus.trigger('web3:initialised', web3);
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        this.updateStatus('not installed');
      }
    });
  }

  userInfoListener() {
    bus.on('ERC20:balance:sent', (bal) => {
      this.setState({
        daiBalance: bal
      })
    });
    bus.trigger('ERC20:balance:requested');
     

    bus.on('ETH:balance:sent', (bal) => {
      this.setState({
        ethBalance: bal
      })
    });
    bus.trigger('ETH:balance:requested');

    bus.on('status', (status, address) => {
      this.setState({
        status: status,
        address: address
      })
    });
  }

  render() {
    return (
      <SubscriptionInfo
        status={this.state.status}
        userAddress={this.state.address}
        ethBalance={this.state.ethBalance}
        daiBalance={this.state.daiBalance}
      />
    );
  }
};

export default MetamaskHandler;