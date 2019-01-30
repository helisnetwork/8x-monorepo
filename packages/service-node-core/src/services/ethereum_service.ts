import { NetworkService, DelayPeriod, BasicEvent } from '../types';
import { AddressBook, Address } from '@8xprotocol/types';

import Web3 = require("web3");
import EightEx from '8x.js';
import BigNumber from 'bignumber.js';
import { StakeContract, MockTokenContract, ExecutorAbi, ExecutorContract, PayrollSubscriptionContract, PayrollSubscriptionAbi } from '@8xprotocol/artifacts';
import { AbiDefinition } from 'ethereum-types';

export default class EthereumService implements NetworkService {

  web3: Web3;
  eightEx: EightEx;
  serviceNode: Address;

  addressBook: AddressBook;
  delayPeriod: DelayPeriod;
  
  eventsUpdated: (() => (any));

  private TX_DEFAULTS: any;
  private executorContract: ExecutorContract;

  constructor(provider: any, account: Address, addressBook: AddressBook, delayPeriod: DelayPeriod) {
    this.web3 = new Web3(provider);
    this.eightEx = new EightEx(this.web3, {});
    this.addressBook = addressBook;
    this.serviceNode = account;
    this.delayPeriod = delayPeriod;

    const DEFAULT_GAS_LIMIT: BigNumber = new BigNumber(1000000); // Default of 1 million gas
    const DEFAULT_GAS_PRICE: BigNumber = new BigNumber(4000000000); // 2 gEei

    this.TX_DEFAULTS = {
      from: account, // default to first account from provider
      gas: DEFAULT_GAS_LIMIT,
      // gasPrice: DEFAULT_GAS_PRICE
    };

    var balance = this.web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1", (error, result) => {
      console.log('Error ' + error);
      console.log('Account ' + account);
      console.log('Result ' + result.toNumber()); // 1000000000000
    });

    console.log(this.addressBook);
  }

  async attemptTopUp(amount: BigNumber): Promise<any> {
    
    let stakeContract = await StakeContract.at(this.addressBook.stakeContractAddress, this.web3, {});
    let stakeTokenContract = await MockTokenContract.at(this.addressBook.stakeTokenAddress, this.web3, {});
    let tokenAddresses = this.addressBook.transactingTokenAddresses || [this.addressBook.transactingTokenAddress];
    
    console.log(this.serviceNode, tokenAddresses);

    await this.asyncForEach(tokenAddresses, async (token) => {
      let existingBalance = await stakeContract.getTotalStake.callAsync(this.serviceNode, token);

      console.log(existingBalance.toNumber(), amount.toNumber());
      console.log(this.serviceNode, token);

      if (existingBalance.toNumber() == amount.toNumber()) {
        console.log("Skipped top up");
        return;
      }

      console.log('Approving token...');

      let approveTx = await stakeTokenContract.approve.sendTransactionAsync(
        stakeContract.address,
        amount,
        this.TX_DEFAULTS
      );

      console.log(approveTx);

      await this.eightEx.blockchain.awaitTransactionMinedAsync(approveTx);

      console.log('Topping up...');

      let topupTx = await stakeContract.topUpStake.sendTransactionAsync(
        amount,
        token,
        { from: this.serviceNode }
      );

      console.log(topupTx);

      return await this.eightEx.blockchain.awaitTransactionMinedAsync(topupTx);
    });
  }

  async watchExecutor(callback: (any) => (any), fromBlock: number, toBlock: number) {

    this.executorContract = await ExecutorContract.at(this.addressBook.executorAddress, this.web3, {});

    const contract = this.web3.eth.contract(ExecutorAbi.abi as AbiDefinition[]).at(this.addressBook.executorAddress);
    const eventsWatcher = contract.allEvents({
      fromBlock: fromBlock,
      toBlock: toBlock < 0 ? 'latest' : toBlock,
    });

    eventsWatcher.watch((error, log) => {
      if (log) {  
        callback(log);
      } else {
        console.log('Empty log outputted');
      }
    });

  }

  async watchPayroll(callback: (any) => (any), fromBlock: number, toBlock: number) {

    const contract = this.web3.eth.contract(PayrollSubscriptionAbi.abi as AbiDefinition[]).at(this.addressBook.payrollSubscriptionAddress);
    const eventsWatcher = contract.allEvents({
      fromBlock: fromBlock,
      toBlock: toBlock < 0 ? 'latest' : toBlock,
    });

    eventsWatcher.watch((error, log) => {
      if (log) {  
        callback(log);
      } else {
        console.log('Empty log outputted');
      }
    });

  }

  async activate(events: BasicEvent[]): Promise<any> {

    await this.asyncForEach(events, async (event) => {
      console.log(`Sending activate tx ${JSON.stringify(event)}`);
      
      try {
        await this.executorContract.activateSubscription.sendTransactionAsync(
          event.contractAddress,
          event.paymentIdentifier,
          this.TX_DEFAULTS
        );
      } catch (error) {
        console.log(error);
      }
    });

  }

  async process(events: BasicEvent[]): Promise<any> {
    
    await this.asyncForEach(events, async (event) => {
      console.log(`Sending process tx ${JSON.stringify(event)}`);

      try {
        await this.executorContract.processSubscription.sendTransactionAsync(
          event.contractAddress,
          event.paymentIdentifier,
          this.TX_DEFAULTS
        );
      } catch (error) {
        console.log(error);
      }

    });
  }

  async catchLate(events: BasicEvent[]): Promise<any> {

    await this.asyncForEach(events, async (event) => {
      console.log(`Sending catch late tx ${JSON.stringify(event)}`);

      try {
        await this.executorContract.catchLateSubscription.sendTransactionAsync(
          event.contractAddress,
          event.paymentIdentifier,
          this.TX_DEFAULTS
        );
      } catch (error) {
        console.log(error);
      }
    });

  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

}