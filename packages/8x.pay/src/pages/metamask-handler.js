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
  updateStatus(status,address,balance) {
    this.setState({
      status: status,
      address: address,
      ethBalance: balance
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
        web3.eth.sendTransaction({/* ... */});
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
  // Checks if user is logged into MetaMask
  // checkMetaMaskState () {
  //   bus.on('web3:initialised', (web3) => {
  //     web3.eth.getAccounts((err, accounts) => {
  //       if (err != null) {
  //         console.log(err);
  //         this.updateStatus('error');
  //       } else if (accounts.length === 0) {
  //         console.log('MetaMask is locked');
  //         this.updateStatus('locked');
  //       } else {
  //         this.updateStatus('unlocked');
  //         this.getMetaMaskData();
  //       }
  //     });
  //   });
  // }

  // Checks for user account changes (login, logout) on metamask and updates state if valid.
  // watchMetaMaskState() {
  //   var account = web3.eth.accounts[0];
  //   var accountInterval = setInterval(() => {
  //     if (web3.eth.accounts[0] !== account) {
  //       account = web3.eth.accounts[0];
  //       this.checkMetaMaskState();
  //     }

  //     this.checkMetaMaskBalance();
  //   }, 100);
  // }

  // Checks MetaMask balance every 5 seconds while waiting for user deposit
  // checkMetaMaskBalance() {
  //   setTimeout(() => {
  //     this.getMetaMaskData();
  //   }, 2000);
  // };

  // Supplies components with MetaMask address and balance
  // getMetaMaskData() {
  //   bus.on('status', (status, address) => {
  //     this.updateStatus(
  //       status,
  //       address
  //     );
      // this.getERC20Balance();
      // this.web3 = web3;
      // var address = web3.eth.accounts[0];
      // this.updateStatus('unlocked');
      // web3.eth.getBalance(address, (err,result) => {
      //   if (!err){
      //     this.updateStatus(
      //       this.state.status,
      //       address,
      //       web3.fromWei(result, 'ether').toNumber()
      //     );
      //   } else {
      //     console.log('error');
      //   }
      // });
      // this.getERC20Balance();
  //   });
  // }

  // Gets DAI balance of user address
  // getERC20Balance() {
  //   var token = web3.eth.contract(MockTokenAbi.abi).at(getToken('DAI'));

  //   token.balanceOf.call(web3.eth.accounts[0],  (err, bal) => {
  //     if (err) {
  //       console.error(err);
  //     }

  //     const divideBalance = bal/Math.pow(10,18);

  //     this.setState({
  //       daiBalance: divideBalance
  //     });

  //   });
  // }

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