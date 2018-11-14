import Web3 = require('web3');

import {
  ExecutorAbi,
  ExecutorContract
} from '@8xprotocol/artifacts';

import SubscriptionEvent from '../types/';
import { AbiDefinition } from "ethereum-types";

export default class EventManagementStore {

  private web3: Web3;
  private executorContract: ExecutorContract;

  public eventsUpdated: () => (void);
  public events: { [id: string] : SubscriptionEvent } = {};

  constructor(web3: Web3, executorContract: ExecutorContract, callback: () => (void)) {
    this.web3 = web3;
    this.eventsUpdated = callback;
    this.executorContract = executorContract;
  }

  public async startContractListener() {
    const contract = this.web3.eth.contract(ExecutorAbi.abi as AbiDefinition[]).at(this.executorContract.address);
    //Start finding events from 1 hr ago to most recent block
    const eventsWatcher = contract.allEvents({
      fromBlock: "latest" - 240,
      toBlock: "latest",
    });

    eventsWatcher.watch((error, log) => {
      if (log.event == 'SubscriptionActivated') {
        this.handleActivation(log);
      } else if (log.event == 'SubscriptionProcessed') {
        this.handleProcessed(log);
      } else if (log.event == 'SubscriptionCancelled') {
        this.handleCancelled(log);
      }

      this.eventsUpdated();
    });
  }

    private handleActivation(log) {
      console.log(`Received Activated: ${JSON.stringify(log, null, 2)}`);
  
      let newEvent = {
        subscriptionAddress: log.args.subscriptionAddress,
        subscriptionIdentifier: log.args.subscriptionIdentifier,
        tokenAddress: log.args.tokenAddress,
        dueDate: log.args.dueDate.toNumber(),
        amount: log.args.amount.toNumber(),
        fee: log.args.fee.toNumber(),
        blockNumber: log.blockNumber,
        transactionIndex: log.transactionIndex,
        transactionHash: log.transactionHash,
        cancelled: false
      } as SubscriptionEvent
  
      this.events[newEvent.subscriptionIdentifier] = newEvent;
    }

    private handleProcessed(log) {
      console.log(`Received Processed: ${JSON.stringify(log, null, 2)}`);
  
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
      existingEvent.transactionHash = log.transactionHash;
  
      this.events[existingEvent.subscriptionIdentifier] = existingEvent;
  
    }

    private handleCancelled(log) {
      console.log(`Recieved Cancelled: ${JSON.stringify(log, null, 2)}`);
  
      let existingEvent = this.events[log.args.subscriptionIdentifier];
  
      if (log.blockNumber < existingEvent.blockNumber) {
        if (log.transactionIndex < existingEvent.transactionIndex) {
          return;
        }
      }
  
      existingEvent.cancelled = true;
  
      this.events[existingEvent.subscriptionIdentifier] = existingEvent;
    }

  }