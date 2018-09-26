import Web3 = require("web3");

import { ExecutorAbi, ExecutorContract } from '@8xprotocol/artifacts'
import { AddressBook, Address } from '@8xprotocol/types';

import SubscriptionEvent from "./types";

import EventStore from './store/events';
import ProcessorStore from "./store/processor";

export default class Repeater {

  private web3: Web3;
  private executorContract: ExecutorContract;

  private executorAddress: Address;
  private serviceNodeAccount: Address;

  public eventStore: EventStore
  public processorStore: ProcessorStore;

  public repeaterUpdated: () => (void) | null;

  constructor(web3: Web3, executorAddress: Address, serviceNodeAccount: Address) {
    this.web3 = web3;
    this.executorAddress = executorAddress;
    this.serviceNodeAccount = serviceNodeAccount;
  }

  public async start() {
    this.executorContract = await ExecutorContract.at(this.executorAddress, this.web3, {});

    this.eventStore = new EventStore(this.web3, this.executorContract, () => this.storeUpdated());
    this.processorStore = new ProcessorStore(this.web3, this.serviceNodeAccount, this.executorContract);

    await this.eventStore.startListening();
  }

  public storeUpdated() {
    this.processorStore.setEvents(Object.values(this.eventStore.events));
    this.repeaterUpdated();
  }

}