import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';
import { TxData, Bytes32, AddressBook, Plan, Subscription, Address, TxHash } from '@8xprotocol/types';
import { BigNumber } from '@8xprotocol/types/node_modules/bignumber.js';

/**
  * Plans
  *
  * @comment The plans API primarily provides functionality for a business to create, get and cancel subscription plans.
  * A subscription plan is required in order to link a user's commitment with static on-chain data which can't
  * be manipulated (with the exception of a title and description).
  *
  * @path eightEx.plans
*/

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
   * Create plan
   *
   * A subscription plan is needed in order to provide an instance for a consumer to subscribe to.
   *
   * @param owner         Owner of the subscription
   * @param token         Token to receive payments in
   * @param identifier    External identifier to use to retrieve subscribers
   * @param interval      Interval, in seconds, to charge a user
   * @param amount        Amount to charge a user
   * @param fee           Amount to set as the processing fee
   * @param name          Your organisation/name (eg 'Netflix', 'SaaS dApp'). Shown to user.
   * @param description   Description for your plan (eg 'Premium Plan'). Shown to user.
   * @param imageUrl      Logo for your busines/plan. Shown to user.
   * @param metaData      Any extra data you'd like to store on-chain (JSON format).
   * @param txData        Provide signer, gas and gasPrice information (optional).
   *
   * @returns             Unique identifying hash of the plan
   * @priority            1
  */
  public async create(
    owner: string,
    identifier: string,
    interval: number,
    amount: BigNumber,
    fee: BigNumber,
    name: string,
    description: string,
    imageUrl: string | null,
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    return await this.volumeSubscriptionWrapper.createPlan(
      owner,
      this.addressBook.transactingTokenAddress || '',
      identifier,
      interval,
      amount,
      fee,
      name,
      description,
      imageUrl,
      metaData,
      txData
    );

  }

  /**
   * Get plan
   *
   * Retrieve the details of a subscription plan
   *
   * @param planHash      Plan hash returned upon creating a plan.
   *
   * @response
   * ```
   * {
   *    owner: '0xbn38s...',
   *    tokenAddress: '0xfns83c...',
   *    identifier: 'com.your.plan.identifier',
   *    interval: 30,
   *    amount: 1000000000000000000, // Most token use 18 decimal places so this is actually 10
   *    fee: 10000000000000000, // Similarly, this is actuall 1/10 of a token
   *    data: '',
   *    name: 'Netflix',
   *    description: 'Premium plan',
   *    imageUrl: 'https://netflix.com/logo,
   *    terminationDate: 155324929, // (epoch - seconds),
   *    planHash: '0xd834n2k...'
   * }
   * ```
   *
   * @returns             A plan object
   * @priority            2
  */
  public async get(
    planHash: string
  ): Promise<Plan> {

    return await this.volumeSubscriptionWrapper.getPlan(planHash);

  }

  /**
   * Get all plans
   *
   * Find all the subscription plans you've created.
   *
   * @param owner   The user who you'd like to get plans for.
   *
   * @returns       An array of Plan objects
   * @priority      3
   */
  public async getAllFor(
    owner: Address
  ): Promise<Plan[]> {

    return await this.volumeSubscriptionWrapper.getPlans(owner);

  }

  /**
   * Get subscribers
   *
   * Get all the subscribers of a subscription plan
   *
   * @param planHash    Plan hash returned upon creating a plan
   *
   * @returns           An array of Subscription objects
   * @priority          4
   */
  public async getSubscribers(
    planHash: Bytes32
  ): Promise<Subscription[]> {

    return await this.volumeSubscriptionWrapper.getSubscriptionsByPlan(planHash);

  }

  /**
   * Cancel plan
   *
   * Cancel a subscription plan that you've offered to your subscribers.
   *
   * @param planHash     Plan hash returned upon creating a plan
   * @param txData       Provide signer, gas and gasPrice information (optional).
   *
   * ```response
   * [ 0x58e5a0fc7fbc849eddc100d44e86276168a8c7baaa5604e44ba6f5eb8ba1b7eb ]
   * ```
   *
   * @returns            Hash of the transaction upon completion
   * @priority           5
   */
  public async cancel(
    planHash: string,
    txData?: TxData
  ): Promise<TxHash> {

    return await this.volumeSubscriptionWrapper.terminatePlan(planHash, txData);

  }

  public test(): number {
      return 0;
  }

}