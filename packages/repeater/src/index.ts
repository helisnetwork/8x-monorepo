import Web3 = require("web3");

import { ExecutorAbi } from '@8xprotocol/artifacts'
import { AddressBook } from '@8xprotocol/types';

import EventStore from './store/events';

export default class Repeater {

  private web3: Web3;
  private addressBook: AddressBook;

  public eventStore: EventStore
  public repeaterUpdated: () => (void);

  constructor(addressBook: AddressBook, provider?: any, privateKey?: string) {
    this.web3 = new Web3(provider || privateKey);
    this.addressBook = addressBook;
    this.eventStore = new EventStore(this.web3, addressBook.executorAddress || '', () => this.storeUpdated());
  }

  public async start() {
    await this.eventStore.startListening();
  }

  public storeUpdated() {
    console.log('Store updated was called');
    this.repeaterUpdated();
  }

}