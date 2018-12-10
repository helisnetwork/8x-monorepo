import { NetworkService, DelayPeriod, BasicEvent } from '../types';
import { AddressBook, Address } from '@8xprotocol/types';

import Web3 = require('aion-web3');
import BigNumber from 'bignumber.js';
import { StakeContract_Aion, WETH_Aion, Executor_Aion, PayrollSubscription_Aion } from '@8xprotocol/artifacts';
import { AbiDefinition } from 'ethereum-types';

export default class EthereumService implements NetworkService {

  web3: Web3;
  account: any;
  serviceNode: any;

  addressBook: AddressBook;
  delayPeriod: DelayPeriod;
  
  eventsUpdated: (() => (any));

  private TX_DEFAULTS: any;
  private executorContract: any;

  constructor(privateKey: any, nodeAddress: string, addressBook: AddressBook, delayPeriod: DelayPeriod) {

    const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress));
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    
    this.web3 = web3;
    this.account = account;
    this.addressBook = addressBook;
    this.delayPeriod = delayPeriod;
  }

  async attemptTopUp(amount: BigNumber): Promise<any> {
    
    let stakeContract = new this.web3.eth.Contract(StakeContract_Aion.abi, this.addressBook.stakeContractAddress);
    let stakeTokenContract = new this.web3.eth.Contract(WETH_Aion.abi, this.addressBook.stakeTokenAddress);

    console.log(this.account, this.addressBook);
    
    await this.asyncForEach((this.addressBook.transactingTokenAddresses || [this.addressBook.transactingTokenAddress]), async (token) => {

      console.log(1);
      let existingBalance = await stakeContract.methods.getTotalStake(this.account.address, token).call();
      console.log(existingBalance);
      console.log('top up: ' + amount + ' | existing: ' + existingBalance);
      if (existingBalance == amount) {
        console.log("Skipped top up");
        return;
      }
      console.log(2);

      let approveTx = await stakeTokenContract.methods.approve(
        this.addressBook.stakeContractAddress,
        amount.toString(),
      ).encodeABI();
      console.log(amount.toString());
      await this.executeTransaction(approveTx, this.addressBook.stakeTokenAddress);
      console.log(3);

      let topupTx = await stakeContract.methods.topUpStake(
        amount.toString(),
        token
      ).encodeABI();
      console.log("pls reach here");
      console.log(topupTx);
      let result = await this.executeTransaction(topupTx, this.addressBook.stakeContractAddress);
      console.log(4);
      return result;

    });
  }

  async watchExecutor(fromBlock: number, toBlock: number, callback: (any) => (any)) {
    console.log("Starting to watch exceutor");
    this.executorContract = new this.web3.eth.Contract(Executor_Aion.abi, this.addressBook.executorAddress);
    this.executorContract.events.allEvents({
      fromBlock: fromBlock,
      toBlock: toBlock < 0 ? 'latest' : toBlock
    }, (error, log) => {
      if (log) {  
        callback(log);
      } else {
        console.log('Empty log outputted');
      }
    }).on('data', function(event){
      console.log(event); // same results as the optional callback above
    });

  }

  async watchPayroll(fromBlock: number, toBlock: number, callback: (any) => (any)) {
    console.log("Starting to watch payroll");

    const contract = new this.web3.eth.Contract(PayrollSubscription_Aion.abi, this.addressBook.payrollSubscriptionAddress);
    contract.events.allEvents({
      fromBlock: fromBlock,
      toBlock: toBlock < 0 ? 'latest' : toBlock,
    }, (error, log) => {
      console.log(error, log);
      if (log) {  
        callback(log);
      } else {
        console.log('Empty log outputted');
      }
    }).on('data', function(event){
      console.log(event); // same results as the optional callback above
    })

  }

  async activate(events: BasicEvent[]): Promise<any> {

    await this.asyncForEach(events, async (event) => {
      console.log(`Sending activate tx ${JSON.stringify(event)}`);
      
      try {
        let data = this.executorContract.methods.activateSubscription(
          event.contractAddress,
          event.paymentIdentifier
        );
        await this.executeTransaction(data, this.addressBook.executorAddress);
      } catch (error) {
        console.log(error);
      }
    });

  }

  async process(events: BasicEvent[]): Promise<any> {
    
    await this.asyncForEach(events, async (event) => {
      console.log(`Sending process tx ${JSON.stringify(event)}`);

      try {
        let data = this.executorContract.methods.processSubscription(
          event.contractAddress,
          event.paymentIdentifier
        );
        await this.executeTransaction(data, this.addressBook.executorAddress);
      } catch (error) {
        console.log(error);
      }

    });
  }

  async catchLate(events: BasicEvent[]): Promise<any> {

    await this.asyncForEach(events, async (event) => {
      console.log(`Sending catch late tx ${JSON.stringify(event)}`);

      try {
        let data = this.executorContract.methods.catchLateSubscription(
          event.contractAddress,
          event.paymentIdentifier
        );
        await this.executeTransaction(data, this.addressBook.executorAddress);
      } catch (error) {
        console.log(error);
      }
    });

  }

  async executeTransaction(data, address) {
    console.log('Executing transaction...');
  
    var txCallIncrement = {
      from: this.account.address, 
      to: address, 
      gas: 2000000,
      data: data
      // nonce: currentNoncePending
    };
  
    // Sign it
    let signedIncrementCall = await this.web3.eth.accounts.signTransaction(
      txCallIncrement, this.account.privateKey
    );

    console.log("Signed transaction, waiting to send...");
  
    let interactionReceipt = await this.web3.eth.sendSignedTransaction(
      signedIncrementCall.rawTransaction
    ).on('transactionHash', txHash => { 
      console.log('txHash', txHash);
    }).on('receipt',
      receipt => { 
        console.log('receipt', receipt);
      }
    );
  
    console.log('Executed -> ', interactionReceipt);
    return interactionReceipt;
  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

}