import React from 'react';
import Web3 from 'web3';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import ProviderEngine from 'web3-provider-engine';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger';

class LedgerHandler extends React.Component{
  constructor(props){
    super(props);
  }

  initialiseLedger() {
    if(typeof window.web3 !== 'undefinied') {
      console.log('web3 is already initialised');

    } else {
      this.onConnectLedgerRequest();
      // Create web3 with ledger device
      this.getWeb3();
      
    }
  }

  onConnectLedgerRequest () { 
    promptUserToConnectLedger(); 
    console.log('Please connect');
  }

  getWeb3 () {
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

};

export default LedgerHandler;