import * as Web3 from 'web3';
import { SubscriptionEvent, BasicEvent } from '../types';

import { ExecutorContract } from '@8xprotocol/artifacts';
import { Address } from '@8xprotocol/types';

import EightEx from '8x.js';
import BigNumber from 'bignumber.js';

export default class ProcessorStore {

  private web3: Web3;
  private executorContract: ExecutorContract;
  private serviceNodeAccount: Address;
  private eightEx: EightEx;
  private TX_DEFAULTS: any;

  public executedTransactionHashes: string[];
  public events: BasicEvent[];

  constructor(web3: Web3, eightEx: EightEx, serviceNodeAccount: Address, executorContract: ExecutorContract) {
    this.web3 = web3;
    this.eightEx = eightEx;
    this.events = [];
    this.executedTransactionHashes = [];
    this.executorContract = executorContract;
    this.serviceNodeAccount = serviceNodeAccount;

    const DEFAULT_GAS_LIMIT: BigNumber = new BigNumber(6712390); // Default of 6.7 million gas
    const DEFAULT_GAS_PRICE: BigNumber = new BigNumber(6000000000); // 6 gEei

    this.TX_DEFAULTS = {
      from: serviceNodeAccount, // default to first account from provider
      gas: DEFAULT_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE
    };

    this.start();
  }

  private async start() {
    await this.checkEvents();
  }

  public setEvents(events: BasicEvent[]) {
    this.events = events.filter((event) => event.cancelled == false);

    console.log(`Current events are: ${JSON.stringify(this.events, null, 2)}`);
    console.log(`Executed events are: ${JSON.stringify(this.executedTransactionHashes, null, 2)}`);
  }

  public async checkEvents() {

    if (!this.events) {
      await this.retry();
      return;
    }

    this.events = this.events.filter((item) => {
      return !this.executedTransactionHashes.includes(item.transactionHash)
    });

    let now = (Date.now() / 1000);

    let toProcess = this.events.filter((event) => {
      let result = (
        (now >= event.dueDate + 60) &&
        (now <= (event.dueDate + 120)) &&
        (!event.claimant || event.claimant == this.serviceNodeAccount)
      );

      if (result) {
        console.log(`Now: ${now}, Due Date ${event.dueDate}, Claimant: ${event.claimant}, Service Node: ${this.serviceNodeAccount}`);
      }

      return result;

    });

    let toCatchLate = this.events.filter((event) => {
      let result = (
        (now >= (event.dueDate + 120)) &&
        (now <= (event.dueDate + 240)) &&
        (event.claimant && event.claimant != this.serviceNodeAccount)
      );

      if (result) {
        console.log(`Now: ${now}, Due Date ${event.dueDate}, Claimant: ${event.claimant}, Service Node: ${this.serviceNodeAccount}`);
      }

      return result;

    });

    console.log(`Processing queue ${JSON.stringify(toProcess)}`);
    console.log(`Catch queue ${JSON.stringify(toCatchLate)}`);

    await this.handleProcessing(toProcess);
    await this.handleCatchLate(toCatchLate);

    await this.retry();
  }

  public async retry() {
    console.log('Retrying');

    await this.timeout(2000);
    await this.checkEvents();
  }

  public async handleProcessing(events: BasicEvent[]) {

    this.asyncForEach(events, async (event) => {
      console.log(`Sending process tx ${JSON.stringify(event)}`);
      this.executedTransactionHashes.push(event.transactionHash);

      try {
        await this.executorContract.processSubscription.sendTransactionAsync(
          event.subscriptionAddress,
          event.subscriptionIdentifier,
          this.TX_DEFAULTS
        );
      } catch (error) {
        console.log(error);
      }

    });

  }

  public async handleCatchLate(events: BasicEvent[]) {

    this.asyncForEach(events, async (event) => {
      console.log(`Sending catch late tx ${JSON.stringify(event)}`);
      this.executedTransactionHashes.push(event.transactionHash);

      try {
        await this.executorContract.catchLateSubscription.sendTransactionAsync(
          event.subscriptionAddress,
          event.subscriptionIdentifier,
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

  private async timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}