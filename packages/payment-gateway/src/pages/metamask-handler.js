/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      status: 'loading',
      address: '',
      ethBalance: '',
      daiBalance: ''
    };

  }

  componentDidMount() {
    this.initialiseMetaMask();
  }
  // Function used to update the state of MetaMask Handler.
  updateStatus(status,address,balance) {
    this.setState({
      status: status,
      address: address,
      ethBalance: balance
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
    this.getERC20Balance();
  }

  // Gets DAI balance of user address
  getERC20Balance() {
    var abi = require('../assets/ABI/ERC20.json');
    var token = web3.eth.contract(abi).at('0xc4375b7de8af5a38a93548eb8453a498222c4ff2');

    token.balanceOf.call(web3.eth.accounts[0],  (err, bal) => {
      if (err) { 
        console.error(err); 
      }

      const divideBalance = bal/Math.pow(10,18);
      
      this.setState({
        daiBalance: divideBalance
      });
      
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