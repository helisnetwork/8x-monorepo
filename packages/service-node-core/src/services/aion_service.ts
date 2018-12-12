import { NetworkService, DelayPeriod, BasicEvent } from '../types';
import { AddressBook, Address } from '@8xprotocol/types';

import Web3 = require('aion-web3');
import BigNumber from 'bignumber.js';
import interval from '../helpers/interval';

import { StakeContract_Aion, WETH_Aion, Executor_Aion, PayrollSubscription_Aion } from '@8xprotocol/artifacts';
import { AbiDefinition } from 'ethereum-types';

const refreshPeriod = 20000;

export default class EthereumService implements NetworkService {

  web3: Web3;
  account: any;
  serviceNode: any;

  addressBook: AddressBook;
  delayPeriod: DelayPeriod;
  
  eventsUpdated: (() => (any));

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

      let existingBalance = await stakeContract.methods.getTotalStake(this.account.address, token).call();

      if (existingBalance == amount) {
        console.log("Skipped top up");
        return;
      }

      let allowanceAmount = await stakeTokenContract.methods.allowance(this.account.address, this.addressBook.stakeContractAddress).call();

      if (allowanceAmount < amount) {
        let approveTx = stakeTokenContract.methods.approve(
          this.addressBook.stakeContractAddress,
          amount.toString(),
        ).encodeABI();

        await this.executeTransaction(approveTx, this.addressBook.stakeTokenAddress);
      } else {
        console.log("Allowance already given, only top up required");
      }

      let topupTx = stakeContract.methods.topUpStake(
        amount.toString(),
        token
      ).encodeABI();

      return await this.executeTransaction(topupTx, this.addressBook.stakeContractAddress);

    });
  }

  async watchExecutor(callback: (any) => (any), fromBlock?: number, toBlock?: number) {
    console.log("Starting to watch exceutor");

    let existingEvents = [];
    this.executorContract = new this.web3.eth.Contract(Executor_Aion.abi, this.addressBook.executorAddress);

    interval(async () => {
      console.log("Rechecking executor events");
      await this.checkEvents(this.executorContract, existingEvents, callback, fromBlock, toBlock);
    }, refreshPeriod);
  }

  async watchPayroll(callback: (any) => (any), fromBlock?: number, toBlock?: number) {
    console.log("Starting to watch payroll");

    let existingEvents = [];
    const contract = new this.web3.eth.Contract(PayrollSubscription_Aion.abi, this.addressBook.payrollSubscriptionAddress);

    interval(async () => {
      console.log("Rechecking payroll events");
      await this.checkEvents(contract, existingEvents, callback, fromBlock, toBlock);
    }, refreshPeriod);

  }

  async activate(events: BasicEvent[]): Promise<any> {

    await this.asyncForEach(events, async (event) => {
      console.log(`Sending activate tx ${JSON.stringify(event)}`);
      
      try {
        let data = this.executorContract.methods.activateSubscription(
          event.contractAddress,
          event.paymentIdentifier
        ).encodeABI();
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
        ).encodeABI();
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
        ).encodeABI();
        await this.executeTransaction(data, this.addressBook.executorAddress);
      } catch (error) {
        console.log(error);
      }
    });

  }

  async executeTransaction(data, address) {
    console.log('Executing transaction...');

    let currentNoncePending = await this.web3.eth.getTransactionCount(this.account.address, 'pending');
  
    var txCallIncrement = {
      from: this.account.address, 
      to: address, 
      gas: 2000000,
      data: data,
      nonce: currentNoncePending
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

  private async checkEvents(contract: any, existingEvents: any[], callback: (any) => (any), fromBlock?: number, toBlock?: number) {
    console.log("Checking for new events");

    const blockNum = await this.web3.eth.getBlockNumber();

    const finalFromBlock = fromBlock || (blockNum - 1000).toString();
    const finalToBlock = toBlock || 'latest';

    let result = await contract.getPastEvents('AllEvents', { fromBlock: fromBlock || finalFromBlock, toBlock: finalToBlock });

    result
    .filter((event) => existingEvents.includes(event.id) == false)
    .map((event) => {
      let newObject = event;
      newObject['args'] = event.returnValues;
      newObject['returnValues'] = null;
      return newObject;
    })
    .forEach((event) => {
      existingEvents.push(event.id);
      callback(event);
    });
  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  private async timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}