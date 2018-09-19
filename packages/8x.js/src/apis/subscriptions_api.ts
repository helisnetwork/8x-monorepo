import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';
import ExecutorWrapper from '../wrappers/executor_wrapper';
import TokenWrapper from '../wrappers/token_wrapper';

import { TxData, TxHash, Bytes32, Address, AddressBook, Plan, Subscription } from '@8xprotocol/types';
import { BigNumber } from '@8xprotocol/types/node_modules/bignumber.js';
import { UNLIMITED_ALLOWANCE } from '../constants';

/**
 *
 * The SubscriptionAPI provides all the functionality for consumers to subscribe to 8x. A user must first subscribe to a subscription,
 * and then they must activate it. Payment is only taken on activation. First time 8x users are required to give pre-authorisation before
 * they can subscribe however.
 *
*/
export default class SubscriptionsAPI {

  private web3: Web3;
  private addressBook: AddressBook;
  private volumeSubscriptionWrapper: VolumeSubscriptionWrapper;
  private executorWrapper: ExecutorWrapper;
  private tokenWrapper: TokenWrapper;

  constructor(
    web3: Web3,
    addressBook: AddressBook,
    volumeSubscriptionWrapper: VolumeSubscriptionWrapper,
    executorWrapper: ExecutorWrapper,
    tokenWrapper: TokenWrapper
  ) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.volumeSubscriptionWrapper = volumeSubscriptionWrapper;
    this.executorWrapper = executorWrapper;
    this.tokenWrapper = tokenWrapper;
  }

  /**
   * Check pre-authorisation
   *
   * In order for 8x to take tokens directly from a user's wallet, it needs authorisation from a user
   * to do so. This permission is given through the ERC20 approve function. Through this
   * functionality you can check whether a user has given approval to the Transfer Proxy (contract
   * that can take tokens from a user directly).
   *
   * @param owner     The user to check whether allowance has been given or not
   *
   * ```response
   * [ true ]
   * ```
   *
   * @returns         A boolean of whether allowance has been given or not.
   * @priority        1
   *
  */
  public async hasGivenAuthorisation(
    owner: Address
  ): Promise<boolean> {

    let allowance = await this.tokenWrapper.allowance(
      this.addressBook.transactingTokenAddress || '',
      owner,
      this.addressBook.transferProxyAddress || ''
    );

    return allowance.toNumber() == UNLIMITED_ALLOWANCE.toNumber();

  }

  /**
   * Give pre-authorisation
   *
   * Grant 8x the pre-authorisation to take tokens from a user's wallet directly. The
   * pre-authorisation is given to the Transfer Proxy contract.
   *
   * @param txData    Provide signer, gas and gasPrice information (optional).
   * @priority        2
  */
  public async giveAuthorisation(txData?: TxData): Promise<TxHash> {

    return await this.tokenWrapper.giveApproval(
      this.addressBook.transactingTokenAddress || '',
      this.addressBook.transferProxyAddress || '',
      UNLIMITED_ALLOWANCE,
      txData
    );

  }

  /**
   * Subscribe
   *
   * Subscribing links the user to the subscription plan. It does not take payment from the user.
   * Payment is only taken when the activate subscription function is called. This is useful in scenarios
   * where you might want to get a user's commitment and then charge them after a certain duration or amount of usage.
   *
   * @param planHash      Unique identifying hash of the plan.
   * @param metaData      Any extra JSON data you'd like to pass/store on-chain (optional).
   * @param txData        Provide signer, gas and gasPrice information (optional).
   *
   * @returns             Unique subscription hash.
   * @priority            3
  */
  public async subscribe(
    planHash: Bytes32,
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    return this.volumeSubscriptionWrapper.createSubscription(
      planHash,
      metaData,
      txData
    );

  }

  /**
   * Activate
   *
   * This function can only be called once a user has subscribed as it requires a valid subscription hash.
   * Provided that a user has subscribed and given authorisation to 8x, the activate function can be called
   * by any user. We're still exploring the best way to lock this down while still providing enough flexibility.
   *
   *
   * @param subscriptionHash    Unique subscription hash returned upon subscribing.
   * @param txData              Provide signer, gas and gasPrice information (optional).
   *
   * @returns                   Hash of the transaction upon completion
   * @priority                  4
  */
  public async activate(
    subscriptionHash: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    return this.executorWrapper.activateSubscription(
      this.addressBook.volumeSubscriptionAddress,
      subscriptionHash,
      txData
    );

  }

  /**
   * Get subscription
   *
   * @param subscriptionHash  Unique subscription hash returned upon subscribing.
   *
   * ```response
   * {
   *    owner: '0xdfLqn83...',
   *    tokenAddress: '0xw9s3mfd...',
   *    planHash: '0xwjw93m3sd...',
   *    lastPaymentDate: 155321434, // (epoch - seconds)
   *    terminationDate: 155452222, // (epoch - seconds)
   * }
   * ```
   *
   * @returns                 A subscription object
   * @priority                5
  */
  public async get(
    subscriptionHash: Bytes32
  ): Promise<Subscription> {

    return this.volumeSubscriptionWrapper.getSubscription(
      subscriptionHash
    );

  }

  /**
   * All subscriptions
   *
   * Get all the subscriptions a user has subscribed to.
   *
   * @param user       The user you'd like to get subscriptions for
   *
   * @returns          An array of subscription objects
   * @priority         6
  */
  public async getSubscribed(
    user: Address
  ): Promise<Subscription[]> {

    return this.volumeSubscriptionWrapper.getSubscriptionsByUser(user);

  }

  /**
   * Cancel a subscription
   *
   * Cancels a subscription and prevents payments from being taken next billing cycle.
   * This can only be called by the user who created the subscription in the first place.
   *
   * @param subscriptionHash    Unique subscription hash returned upon subscribing.
   * @param txData              Provide signer, gas and gasPrice information (optional).
   *
   * @returns                   Hash of the transaction upon completion
   * @priority                  7
   */
  public async cancel(
    subscriptionHash: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    return this.volumeSubscriptionWrapper.cancelSubscription(
      subscriptionHash,
      txData
    );

  }

}