import Web3 = require("web3");
import * as admin from 'firebase-admin';

import { ExecutorAbi, ExecutorContract, Web3Utils } from '@8xprotocol/artifacts'
import EightEx from '8x.js';
import { AddressBook, Address } from '@8xprotocol/types';
import { BigNumber } from 'bignumber.js';

import EventStore from './store/events';
import FirebaseCredentials from "./types";

export default class Repeater {

  private web3: Web3;
  private eightEx: EightEx;
  private web3Utils: Web3Utils;
  private executorContract: ExecutorContract;

  private executorAddress: Address;
  private serviceNodeAccount: Address;

  public eventStore: EventStore;

  public repeaterUpdated: () => (void) | null;

  constructor(web3: Web3, executorAddress: Address, serviceNodeAccount: Address, credentials: FirebaseCredentials) {
    this.web3 = web3;
    this.web3Utils = new Web3Utils(web3);
    this.executorAddress = executorAddress;
    this.serviceNodeAccount = serviceNodeAccount;
    this.eightEx = new EightEx(web3, {});

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: credentials.projectId,
        clientEmail: credentials.clientEmail,
        privateKey: '-----BEGIN PRIVATE KEY-----\n' + credentials.privateKey + '\n-----END PRIVATE KEY-----\n'
      }),
      databaseURL: credentials.databaseUrl
    });
  }

  public async start() {
    this.executorContract = await ExecutorContract.at(this.executorAddress, this.web3, {});

    this.eventStore = new EventStore(this.web3, this.executorContract, () => this.storeUpdated());

    await this.eventStore.startListening();
  }

  public storeUpdated() {
    this.repeaterUpdated();
  }

}