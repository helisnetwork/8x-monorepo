/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';

class MetamaskHandler extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      status: 'not installed',
      address: ''
    };

    this.checkMetaMaskState();
  }

  checkMetaMaskState() {

    if (typeof web3 === 'undefined') {
      console.log('No web3? You should consider trying MetaMask!');
      this.updateStatus('not installed');
      return;
    }

    this.updateStatus('installed');
    console.log('Metamask is installed');

    var provider = web3.currentProvider;

    this.checkMetaMaskLogin();

    var account = web3.eth.accounts[0];
    var accountInterval = setInterval(() => {
      if (web3.eth.accounts[0] !== account) {
        account = web3.eth.accounts[0];
        this.checkMetaMaskLogin();
      }
    }, 100);

  }

  checkMetaMaskLogin () {
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
        this.getMetaMaskAddress(); 
      }
    });
  }

  render() {
    return ( 
      <SubscriptionInfo status={this.state.status} useraddress={this.state.address}/>
    );
  }

  updateStatus(status,address) {
    this.setState({
      status: status,
      address: address
    });
  };

  getMetaMaskAddress() {
    const metamaskaddress = web3.eth.accounts[0];
    this.updateStatus(this.state.status,metamaskaddress);  
  };

};


export default MetamaskHandler;