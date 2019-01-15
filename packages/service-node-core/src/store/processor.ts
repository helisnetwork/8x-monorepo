import * as Web3 from 'web3';
import { SubscriptionEvent, BasicEvent, DelayPeriod, NetworkService } from '../types';

import { ExecutorContract } from '@8xprotocol/artifacts';
import { Address } from '@8xprotocol/types';

import EightEx from '8x.js';
import BigNumber from 'bignumber.js';

const refreshPeriod = 20000;

export default class ProcessorStore {

  private service: NetworkService;

  public executedTransactionHashes: string[];
  public events: BasicEvent[];

  constructor(service: NetworkService) {
    this.service = service;
    this.events = [];
    this.executedTransactionHashes = [];

    this.start();
  }

  private async start() {
    await this.checkEvents();
  }

  public setEvents(events: BasicEvent[]) {
    this.events = events.filter((event) => event.cancelled != true && event.dueDate > ((Date.now()/1000) - (60 * 60)));

    // console.log(`Current events are: ${JSON.stringify(this.events, null, 2)}`);
    // console.log(`Executed events are: ${JSON.stringify(this.executedTransactionHashes, null, 2)}`);
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
      let claimant = parseInt(event.claimant);
      let result = (
        (now >= event.dueDate + this.service.delayPeriod.processing) &&
        (now <= (event.dueDate + (this.service.delayPeriod.catchLate))) &&
        (!event.claimant || event.claimant == this.service.serviceNode || claimant == 0 || claimant == NaN) &&
        event.activated == true
      );

      if (result) {
        console.log(`Now: ${now}, Due Date ${event.dueDate}, Claimant: ${event.claimant}, Service Node: ${this.service.serviceNode}`);
      }

      return result;

    });

    let toCatchLate = this.events.filter((event) => {
      let result = (
        (now >= (event.dueDate + (this.service.delayPeriod.catchLate))) &&
        (now <= (event.dueDate + (this.service.delayPeriod.stopChecking))) &&
        (event.claimant && event.claimant != this.service.serviceNode) &&
        (event.activated == true)
      );

      if (result) {
        console.log(`Now: ${now}, Due Date ${event.dueDate}, Claimant: ${event.claimant}, Service Node: ${this.service.serviceNode}`);
      }

      return result;

    });

    let toActivate = this.events.filter((event) => {
      let result = (
        (now >= event.dueDate) &&
        (event.activated == false)
      );

      if (result) {
        console.log(`Now: ${now}, Due Date ${event.dueDate}, Claimant: ${event.claimant}, Service Node: ${this.service.serviceNode}`);
      }

      return result;
    });

    toActivate.forEach((item) => this.executedTransactionHashes.push(item.transactionHash));
    toProcess.forEach((item) => this.executedTransactionHashes.push(item.transactionHash));
    toCatchLate.forEach((item) => this.executedTransactionHashes.push(item.transactionHash));

    await this.service.activate(toActivate);
    await this.service.process(toProcess);
    await this.service.catchLate(toCatchLate);

    await this.retry();
  }

  public async retry() {
    // console.log(`Retrying - ${Date.now()/1000}`);

    await this.timeout(refreshPeriod);
    await this.checkEvents();
  }

  private async timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}