/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: 'not installed',
      address: '',
      balance: ''
    };

    // @TODO: Fix changing state before component render (warning on console)
    this.initialiseMetaMask();

  }

  // Function used to update the state of MetaMask Handler.
  updateStatus(status,address,balance) {
    this.setState({
      status: status,
      address: address,
      balance: balance
    });
  };
  
  // Checks if MetaMask is installed on the browser and calls MetaMask state functions
  initialiseMetaMask() {

    if (typeof web3 === 'undefined') {
      console.log('No web3? You should consider trying MetaMask!');
      this.updateStatus('not installed');
      return;
    }

    this.updateStatus('installed');
    console.log('Metamask is installed');

    this.checkMetaMaskState();
    this.watchMetaMaskState();

  }

  // Checks if user is logged into MetaMask
  checkMetaMaskState () {
    web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        console.log(err);
        this.updateStatus('error');
      } else if (accounts.length === 0) {
        console.log('MetaMask is locked');
        this.updateStatus('locked');
      } else {
        console.log('MetaMask is unlocked');
        this.updateStatus('unlocked');
        this.getMetaMaskData();
      }
    });
  }

  // Checks for user account changes (login, logout) on metamask and updates state if valid.  
  watchMetaMaskState() {
    var account = web3.eth.accounts[0];
    var accountInterval = setInterval(() => {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        this.checkMetaMaskState();
      }
    }, 100);
  }

  // Supplies components with MetaMask address and balance
  getMetaMaskData() {
    var address = web3.eth.accounts[0];
    web3.eth.getBalance(address, (err,result) => {
      if (!err){
        this.updateStatus(
          this.state.status, 
          address, 
          result.toNumber() + 'ETH'
        );
      } else {
        console.log('error');
      }
    });
  }

  // Renders subscription payment page ref @TODO
  render() {
    return ( 
      <SubscriptionInfo 
        status={this.state.status} 
        useraddress={this.state.address} 
        balance={this.state.balance}
      />
    );
  }
};

export default MetamaskHandler;