import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';
import ExecutorWrapper from '../wrappers/executor_wrapper';

import { TxData, TxHash, Bytes32, Address, AddressBook, Plan, Subscription } from '@8xprotocol/types';
import { BigNumber } from '@8xprotocol/types/node_modules/bignumber.js';

export default class SubscriptionsAPI {

  private web3: Web3;
  private addressBook: AddressBook;
  private volumeSubscriptionWrapper: VolumeSubscriptionWrapper;
  private executorWrapper: ExecutorWrapper;

  constructor(
    web3: Web3,
    addressBook: AddressBook,
    volumeSubscriptionWrapper: VolumeSubscriptionWrapper,
    executorWrapper: ExecutorWrapper
  ) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.volumeSubscriptionWrapper = volumeSubscriptionWrapper;
    this.executorWrapper = executorWrapper;
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
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    return this.volumeSubscriptionWrapper.createSubscription(
      planIdentifier,
      metaData,
      txData
    );

  }

  public async activate(
    subscriptionIdentifier: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    return this.executorWrapper.activateSubscription(
      this.addressBook.volumeSubscriptionAddress,
      subscriptionIdentifier,
      txData
    );

  }

  public async get(
    subscriptionIdentifier: Bytes32
  ): Promise<Subscription> {

    return this.volumeSubscriptionWrapper.getSubscription(
      subscriptionIdentifier
    );

  }

  public async getSubscribed(
    user: Address
  ): Promise<Subscription[]> {

    return this.volumeSubscriptionWrapper.getSubscriptionsByUser(user);

  }

  public async cancel(
    subscriptionIdentifier: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    return this.volumeSubscriptionWrapper.cancelSubscription(
      subscriptionIdentifier,
      txData
    );

  }

}