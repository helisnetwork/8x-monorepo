import React from 'react';
import * as Web3 from 'web3';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import ProviderEngine from 'web3-provider-engine';
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch';
import SubscriptionInfo from './subscripton-info';

// configuration can be overrided by env variables
const rpcUrl = 'https://kovan.infura.io/';
const networkId = 42;

class LedgerHandler extends React.Component{

  constructor(props){
    super(props);
    
    this.state = {
      status: 'unlocked'

    };

    this.initialize();
    
  }

  async initialize() {
    try {
      // const device = await (new Eth(await TransportU2F.create())).getAppConfiguration()
      const engine = new ProviderEngine()
      const getTransport = async () => TransportU2F.create()
      const ledger = createLedgerSubprovider(getTransport, {
        networkId,
        accountsLength: 5,
      })

      // set ETH App on ledger to provider object
      // this.device = device

      engine.addProvider(ledger)
      // engine.addProvider(new RpcSubprovider({ rpcUrl }))
      engine.addProvider(new FetchSubprovider({ rpcUrl }))
      engine.start()

      this.web3 = new Web3(engine)
      this.state = {}

      return this.web3

    } catch (error) {
      console.error(error)
      this.walletAvailable = false
      throw new Error(error)
    }
  }

  async ledgerAddress() {
    this.web3 = await this.createWeb3();
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