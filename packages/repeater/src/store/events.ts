import Web3 = require("web3");
import _ from 'lodash';
import * as ABIDecoder from 'abi-decoder';

import {
  ExecutorAbi,
  ExecutorContract,
  VolumeSubscriptionAbi,
} from '@8xprotocol/artifacts';

import SubscriptionEvent from '../types/';

import { Address } from '@8xprotocol/types';

export default class EventStore {

  private web3: Web3;
  private executorContract: ExecutorContract;

  public eventsUpdated: () => (void);
  public events: { [id: string] : SubscriptionEvent } = {};

  constructor(web3: Web3, executorContract: ExecutorContract, callback: () => (void)) {
    this.web3 = web3;
    this.eventsUpdated = callback;
    this.executorContract = executorContract;
  }

  public async startListening() {
    const contract = this.web3.eth.contract(ExecutorAbi.abi).at(this.executorContract.address);
    const eventsWatcher = contract.allEvents({
      fromBlock: 0,
      toBlock: "latest",
    });

    eventsWatcher.watch((error, log) => {
      if (log.event == 'SubscriptionActivated') {
        this.handleActivation(log);
      } else if (log.event == 'SubscriptionProcessed') {
        this.handleProcessed(log);
      } else if (log.event == 'SubscriptionReleased') {
        this.handleReleased(log);
      } else if (log.event == 'SubscriptionLatePaymentCaught') {
        this.handlePaymentCaught(log);
      } else if (log.event == 'SubscriptionCancelled') {
        this.handleCancelled(log);
      }

      this.eventsUpdated();
    });
  }

  private handleActivation(log) {
    console.log(`Activated: ${JSON.stringify(log, null, 2)}`);

    let newEvent = {
      subscriptionAddress: log.args.subscriptionAddress,
      subscriptionIdentifier: log.args.subscriptionIdentifier,
      tokenAddress: log.args.tokenAddress,
      dueDate: log.args.dueDate.toNumber(),
      amount: log.args.amount.toNumber(),
      fee: log.args.fee.toNumber(),
      blockNumber: log.blockNumber,
      transactionIndex: log.transactionIndex
    } as SubscriptionEvent

    this.events[newEvent.subscriptionIdentifier] = newEvent;
  }

  private handleProcessed(log) {
    console.log(`Processed: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.subscriptionIdentifier];

    if (log.blockNumber <= existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.claimant = log.args.claimant;
    existingEvent.dueDate = log.args.dueDate.toNumber();
    existingEvent.staked = log.args.staked;
    existingEvent.blockNumber = log.blockNumber;
    existingEvent.transactionIndex = log.blockNumber;

    this.events[existingEvent.subscriptionIdentifier] = existingEvent;

  }

  private handleReleased(log) {
    console.log(`Released: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.subscriptionIdentifier];

    if (log.blockNumber < existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.claimant = log.args.claimant;
    existingEvent.dueDate = log.args.dueDate.toNumber();
    existingEvent.staked = log.args.staked;

    this.events[existingEvent.subscriptionIdentifier] = existingEvent;
  }

  private handlePaymentCaught(log) {
    console.log(`Late: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.subscriptionIdentifier];

    if (log.blockNumber < existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.claimant = log.args.claimant;
    existingEvent.dueDate = log.args.dueDate.toNumber();
    existingEvent.staked = log.args.staked;

    this.events[existingEvent.subscriptionIdentifier] = existingEvent;
  }

  private handleCancelled(log) {
    console.log(`Cancelled: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.subscriptionIdentifier];

    if (log.blockNumber < existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.claimant = log.args.claimant;
    existingEvent.dueDate = log.args.dueDate.toNumber();
    existingEvent.staked = log.args.staked;

    this.events[existingEvent.subscriptionIdentifier] = existingEvent;
  }

}