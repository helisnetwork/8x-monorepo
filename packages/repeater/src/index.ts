import Web3 = require("web3");

import { ExecutorAbi } from '@8xprotocol/artifacts'
import { AddressBook } from '@8xprotocol/types';

import EventStore from './store/events';

class Repeater {

  private web3: Web3;

  private addressBook: AddressBook;
  private eventStore: EventStore

  constructor(addressBook: AddressBook, websocket: string) {
    this.web3 = new Web3(websocket);
    this.addressBook = addressBook;
  }

  public async start() {

  }

}