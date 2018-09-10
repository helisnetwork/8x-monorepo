/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: 'loading',
      address: '',
      balance: '',
      kyberConversion: '42',
      timePeriod: ''
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

    console.log('Metamask is installed');

    this.checkMetaMaskState();
    this.watchMetaMaskState();
    this.getKyberInformation(); 

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
      this.checkMetaMaskBalance();
    }, 100);
  }

  // Checks MetaMask balance every 5 seconds while waiting for user deposit
  checkMetaMaskBalance() {
    setTimeout(() => {
      this.getMetaMaskData();
      this.getKyberInformation(); 
    }, 5000);
    
  };

  // Supplies components with MetaMask address and balance
  getMetaMaskData() {
    var address = web3.eth.accounts[0];
    web3.eth.getBalance(address, (err,result) => {
      if (!err){
        this.updateStatus(
          this.state.status, 
          address, 
          web3.fromWei(result, 'ether').toNumber()
        );
      } else {
        console.log('error');
      }
    });
  }

  // Uses Kyber API to get conversion rates
  getKyberInformation() {
    fetch('https://tracker.kyber.network/api/tokens/pairs')
      .then(results => {
        return results.json();
      }).then(data => {
        console.log(data.ETH_DAI.currentPrice);
        var currencyConversion = data.ETH_DAI.currentPrice;
        this.setState({
          kyberConversion: currencyConversion
        });
      });
  };

  // Renders subscription payment page ref @TODO
  render() {
    return ( 
      <SubscriptionInfo 
        status={this.state.status} 
        useraddress={this.state.address} 
        balance={100}//{this.state.balance}
        kyberConversion={this.state.kyberConversion}
      />
    );
  }
};

export default MetamaskHandler;