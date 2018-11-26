import Web3 = require("web3");
import * as ABIDecoder from 'abi-decoder';

import {
  ExecutorAbi,
  ExecutorContract,
  VolumeSubscriptionAbi,
} from '@8xprotocol/artifacts';

import { Store, SubscriptionEvent, BasicEvent } from '../types/';

import { Address } from '@8xprotocol/types';
import { AbiDefinition } from "ethereum-types";

export default class EventStore implements Store {

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
    const contract = this.web3.eth.contract(ExecutorAbi.abi as AbiDefinition[]).at(this.executorContract.address);
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

  getEventsArray(): BasicEvent[] {
    return Object.values(this.events);
  }

  private handleActivation(log) {
    console.log(`Received Activated: ${JSON.stringify(log, null, 2)}`);

    let newEvent = {
      contractAddress: log.args.subscriptionAddress,
      paymentIdentifier: log.args.subscriptionIdentifier,
      tokenAddress: log.args.tokenAddress,
      dueDate: log.args.dueDate.toNumber(),
      amount: log.args.amount.toNumber(),
      fee: log.args.fee.toNumber(),
      blockNumber: log.blockNumber,
      transactionIndex: log.transactionIndex,
      transactionHash: log.transactionHash,
      cancelled: false,
      activated: true
    } as SubscriptionEvent

    this.events[newEvent.paymentIdentifier] = newEvent;
  }

  private handleProcessed(log) {
    console.log(`Received Processed: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.paymentIdentifier];

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
    existingEvent.transactionHash = log.transactionHash;

    this.events[existingEvent.paymentIdentifier] = existingEvent;

  }

  private handleReleased(log) {
    console.log(`Received Released: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.paymentIdentifier];

    if (log.blockNumber < existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.claimant = log.args.claimant;
    existingEvent.dueDate = log.args.dueDate.toNumber();
    existingEvent.staked = log.args.staked;
    existingEvent.transactionHash = log.transactionHash;

    this.events[existingEvent.paymentIdentifier] = existingEvent;
  }

  private handlePaymentCaught(log) {
    console.log(`Recieved Late: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.paymentIdentifier];

    if (log.blockNumber < existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.claimant = log.args.newClaimant;
    existingEvent.transactionHash = log.transactionHash;

    this.events[existingEvent.paymentIdentifier] = existingEvent;
  }

  private handleCancelled(log) {
    console.log(`Recieved Cancelled: ${JSON.stringify(log, null, 2)}`);

    let existingEvent = this.events[log.args.paymentIdentifier];

    if (log.blockNumber < existingEvent.blockNumber) {
      if (log.transactionIndex < existingEvent.transactionIndex) {
        return;
      }
    }

    existingEvent.cancelled = true;

    this.events[existingEvent.paymentIdentifier] = existingEvent;
  }

}