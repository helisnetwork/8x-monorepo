import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';
import { TxData, Bytes32, Address, AddressBook, Plan } from '@8xprotocol/types';
import { BigNumber } from '@8xprotocol/types/node_modules/bignumber.js';

export default class SubscriptionsAPI {

  private web3: Web3;
  private addressBook: AddressBook;
  private volumeSubscriptionWrapper: VolumeSubscriptionWrapper;

  constructor(web3: Web3, addressBook: AddressBook, volumeSubscriptionWrapper: VolumeSubscriptionWrapper) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.volumeSubscriptionWrapper = volumeSubscriptionWrapper;
  }

  public async hasGivenAllowance(
    token: Address
  ): Promise<boolean> {

    return Promise.resolve(false);

  }

  public async giveAllowance(
    token: Address
  ): Promise<boolean> {

    return Promise.resolve(false);

  }

  public async subscribe(
    planIdentifier: Bytes32,
    data: string,
    txData?: TxData
  ): Promise<Bytes32> {

    return Promise.resolve('');

  }

  public async create(
    planIdentifier: Bytes32,
    data: string,
    txData?: TxData
  ): Promise<Bytes32> {

    return Promise.resolve('');

  }

  public async activate(
    planIdentifier: Bytes32,
    txData?: TxData
  ): Promise<Bytes32> {

    return Promise.resolve('');

  }

  public async get(
    planIdentifier: Bytes32
  ): Promise<Plan> {

    return Promise.resolve(null)

  }

  public async cancel(
    planIdentifier: Bytes32,
    txData?: TxData
  ): Promise<boolean> {

    return Promise.resolve(false);

  }

}