import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';

import { TxData, Bytes32, AddressBook } from '@8xprotocol/types';

export default class PlanAPI {

  private web3: Web3;
  private addressBook: AddressBook;
  private volumeSubscriptionWrapper: VolumeSubscriptionWrapper;

  constructor(web3: Web3, addressBook: AddressBook, volumeSubscriptionWrapper: VolumeSubscriptionWrapper) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.volumeSubscriptionWrapper = volumeSubscriptionWrapper;
  }

  /**
   * Create a subscription plan
   *
   * A subscription plan is created in order to provide an instance for a consumer to
   * subscribe to. A consumer can create their own plan allowing for custom subscription
   * payments.
   *
   * @param owner         Owner of the subscription
   * @param token         Token to receive payments in
   * @param identifier    External identifier to use to retrieve subscribers
   * @param interval      Interval, in days, to charge a user
   * @param amount        Amount, in cents, to charge a use
   * @param fee           Amount, in cents, to set as the processing fee
   * @param name          Your organisation/name (eg 'Netflix', 'SaaS dApp'). Shown to user.
   * @param description   Description for your plan (eg 'Premium Plan'). Shown to user.
   * @param metaData      Any extra data you'd like to store on-chain (JSON format)
  */

  public async create(
    owner: string,
    identifier: string,
    interval: number,
    amount: number,
    fee: number,
    name: string,
    description: string,
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    return await this.volumeSubscriptionWrapper.createPlan(
      owner,
      this.addressBook.daiAddress || '',
      identifier,
      interval,
      amount,
      fee,
      name,
      description,
      metaData,
      txData
    );

  }

}