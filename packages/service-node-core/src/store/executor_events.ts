import Web3 = require("web3");
import * as ABIDecoder from 'abi-decoder';

import {
  ExecutorAbi,
  ExecutorContract,
  VolumeSubscriptionAbi,
} from '@8xprotocol/artifacts';

import { Store, SubscriptionEvent, BasicEvent, NetworkService } from '../types/';

import { Address } from '@8xprotocol/types';
import { AbiDefinition } from "ethereum-types";
import { extractNumber } from "../helpers/numbers";

export default class ExecutorStore implements Store {

  private service: NetworkService;

  public eventsUpdated: () => (void);
  public events: { [id: string] : SubscriptionEvent } = {};

  constructor(service: NetworkService, callback: () => (void)) {
    this.service = service;
    this.eventsUpdated = callback;
  }

  public async startListening() {
    await this.service.watchExecutor((log) => {
      console.log(log.event);
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
      contractAddress: log.args.contractAddress,
      paymentIdentifier: log.args.paymentIdentifier,
      tokenAddress: log.args.tokenAddress,
      dueDate: extractNumber(log.args.dueDate),
      amount: extractNumber(log.args.amount),
      fee: extractNumber(log.args.fee),
      blockNumber: log.blockNumber,
      transactionIndex: log.transactionIndex,
      transactionHash: log.transactionHash,
      claimant: log.args.claimant || null,
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
    existingEvent.dueDate = extractNumber(log.args.dueDate);
    existingEvent.staked = log.args.staked;
    existingEvent.blockNumber = log.blockNumber;
    existingEvent.transactionIndex = log.blockNumber;
    existingEvent.transactionHash = log.transactionHash;
    existingEvent.activated = true;

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
    existingEvent.dueDate = extractNumber(log.args.dueDate);
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