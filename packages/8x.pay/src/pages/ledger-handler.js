import React from 'react';
import * as Web3 from 'web3';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import ProviderEngine from 'web3-provider-engine';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
// import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger';
import SubscriptionInfo from './subscripton-info';

// configuration can be overrided by env variables
const rpcUrl = 'https://kovan.infura.io/';
const networkId = 42;


class LedgerHandler extends React.Component{

  constructor(props){
    super(props);
    
    this.state = {
      status: 'locked'

    };

    this.ledgerAddress();
    
  }

  // initializeLedger () {
  //   const web3 = this.getWeb3();
  //   const accounts = new Promise((resolve, reject) => {
  //     web3.eth.getAccounts((error, accounts) => {
  //       if (error) reject(error);
  //       else resolve(accounts);
  //     });
  //   });
  //   console.log(accounts);
  // };

  createWeb3() {
    const engine = new ProviderEngine();
    const getTransport = () => TransportU2F.create();
    const ledger = createLedgerSubprovider(getTransport, {
      networkId,
      accountsLength: 5
    });
    engine.addProvider(ledger);
    engine.addProvider(new FetchSubprovider({ rpcUrl }));
    engine.start();
    return new Web3(engine);
  }

  ledgerAddress() {
    this.web3 = this.createWeb3();
    this.web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        console.log(err);
        this.updateStatus('error');
      } else if (accounts.length === 0) {
        console.log('MetaMask is locked');
        this.updateStatus('locked');
      } else {
        this.updateStatus('unlocked');
        console.log(accounts);
      }
    });
  }

  
  render () {
    return (
      <SubscriptionInfo status={this.state.status}/>
    );
  }
      

};

export default LedgerHandler;