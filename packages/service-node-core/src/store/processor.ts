import * as Web3 from 'web3';
import SubscriptionEvent from '../types';

import { ExecutorContract } from '@8xprotocol/artifacts';
import { Address } from '@8xprotocol/types';
import EightEx from '8x.js';

export default class ProcessorStore {

  private web3: Web3;
  private executorContract: ExecutorContract;
  private serviceNodeAccount: Address;
  private eightEx: EightEx;

  public executedTransactionHashes: string[];
  public events: SubscriptionEvent[];

  constructor(web3: Web3, eightEx: EightEx, serviceNodeAccount: Address, executorContract: ExecutorContract) {
    this.web3 = web3;
    this.eightEx = eightEx;
    this.events = [];
    this.executedTransactionHashes = [];
    this.executorContract = executorContract;
    this.serviceNodeAccount = serviceNodeAccount;

    this.start();
  }

  private async start() {
    await this.checkEvents();
  }

  public setEvents(events: SubscriptionEvent[]) {
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

    let toProcess = this.events.filter((event) => {
      return (
        ((Date.now() / 1000) >= event.dueDate) &&
        (event.claimant == null || event.claimant == this.serviceNodeAccount)
      )
    });

    let toCatchLate = this.events.filter((event) => {
      return (
        ((Date.now() / 1000) >= event.dueDate + 10) &&
        (event.claimant == null)
      )
    });

    await this.handleProcessing(toProcess);
    await this.handleCatchLate(toCatchLate);

    await this.retry();
  }

  public async retry() {
    console.log('Retrying');

    await this.timeout(2000);
    await this.checkEvents();
  }

  public async handleProcessing(events: SubscriptionEvent[]) {

    this.asyncForEach(events, async (event) => {
      console.log(`Sending process tx ${JSON.stringify(event)}`);
      this.executedTransactionHashes.push(event.transactionHash);

      try {
        let txHash = await this.executorContract.processSubscription.sendTransactionAsync(
          event.subscriptionAddress,
          event.subscriptionIdentifier,
          {from: this.serviceNodeAccount}
        );

        await this.eightEx.blockchain.awaitTransactionMinedAsync(txHash);
      } catch (error) {
        console.log(error);
      }

    });

  }

  public async handleCatchLate(events: SubscriptionEvent[]) {

    this.asyncForEach(events, async (event) => {
      console.log(`Sending catch late tx ${event}`);
      this.executedTransactionHashes.push(event.transactionHash);

      try {
        let txHash = await this.executorContract.catchLateSubscription.sendTransactionAsync(
          event.subscriptionAddress,
          event.subscriptionIdentifier,
          {from: this.serviceNodeAccount}
        );

        await this.eightEx.blockchain.awaitTransactionMinedAsync(txHash);
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