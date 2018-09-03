import React from 'react';
import Web3 from 'web3';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import ProviderEngine from 'web3-provider-engine';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger';
import SubscriptionInfo from './subscripton-info';

// configuration can be overrided by env variables
const rpcUrl = process.env.REACT_APP_NETWORK_URL || 'https://mainnet.infura.io/v3/cee44072c2294964a4f357e95dcf71c1';
const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || '1337', 10);

class LedgerHandler extends React.Component{

  constructor(props){
    super(props);
    
    this.state = {
      status: 'locked'

    };

    this.getWeb3();
    this.initializeLedger();
  }


  initializeLedger () {
    const web3 = this.getWeb3();
    const accounts = new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, accounts) => {
        if (error) reject(error);
        else resolve(accounts);
      });
    });
  };

  // create a web3 with the ledger device
  getWeb3() {
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
  };

  
  render () {
    return (
      <SubscriptionInfo status={this.state.status}/>
    );
  }
      

};

export default LedgerHandler;