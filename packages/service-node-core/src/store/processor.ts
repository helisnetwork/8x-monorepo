import * as Web3 from 'web3';
import SubscriptionEvent from '../types';

import { ExecutorContract } from '@8xprotocol/artifacts';
import { Address } from '@8xprotocol/types';

export default class ProcessorStore {

  private web3: Web3;
  private executorContract: ExecutorContract;
  private serviceNodeAccount: Address;

  public events: SubscriptionEvent[];

  constructor(web3: Web3, serviceNodeAccount: Address, executorContract: ExecutorContract) {
    this.web3 = web3;
    this.events = [];
    this.executorContract = executorContract;
    this.serviceNodeAccount = serviceNodeAccount;

    setInterval(this.checkEvents.bind(this), 1000);
  }

  public setEvents(events: SubscriptionEvent[]) {
    this.events = events;
    console.log(`Current events are: ${JSON.stringify(this.events, null, 2)}`);
  }

  public async checkEvents() {

    if (!this.events) {
      return;
    }

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

  }

  public async handleProcessing(events: SubscriptionEvent[]) {

    events.forEach(async (event) => {
      await this.executorContract.processSubscription.sendTransactionAsync(
        event.subscriptionAddress,
        event.subscriptionIdentifier,
        {from: this.serviceNodeAccount}
      );
    });

  }

  public async handleCatchLate(events: SubscriptionEvent[]) {

    events.forEach(async (event) => {
      await this.executorContract.processSubscription.sendTransactionAsync(
        event.subscriptionAddress,
        event.subscriptionIdentifier,
        {from: this.serviceNodeAccount}
      );
    });

  }

}