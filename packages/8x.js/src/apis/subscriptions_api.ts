import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';
import ExecutorWrapper from '../wrappers/executor_wrapper';
import TokenWrapper from '../wrappers/token_wrapper';

import { TxData, TxHash, Bytes32, Address, AddressBook, Plan, Subscription } from '@8xprotocol/types';
import { BigNumber } from '@8xprotocol/types/node_modules/bignumber.js';
import { UNLIMITED_ALLOWANCE } from '../constants';

/**
 * Subscriptions
 *
 * @comment The subscriptions api provides all the functionality for consumers to subscribe to 8x. A user must first subscribe to a subscription,
 * and then they must activate it. Payment is only taken on activation. First time 8x users are required to give pre-authorisation before
 * they can subscribe however.
 *
 * @path eightEx.subscriptions
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
   * @param owner     The user to check whether allowance has been given or not.
   *
   * @response
   * ```
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
   *
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
   * Payment is only taken when the subscription is activated. This is useful in scenarios
   * where you might want to get a user's commitment and then charge them after a certain duration or amount of usage.
   *
   * @param planHash      Unique identifying hash of the plan.
   * @param metaData      Any extra JSON data you'd like to pass/store on-chain (optional).
   * @param txData        Provide signer, gas and gasPrice information (optional).
   *
   * @returns             Unique subscription hash.
   * @priority            3
   *
  */
  public async subscribe(
    planHash: Bytes32,
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    let safeTxData = (txData) || { from: this.web3.eth.accounts[0]};
    let hasEnoughAllowance = await this.hasGivenAuthorisation(safeTxData.from || this.web3.eth.accounts[0]);
    if (!hasEnoughAllowance) {
      throw("EighEx does not have sufficient allowance to subscribe to take funds from a user's wallet")
    }

    let balance = await this.tokenWrapper.balanceOf(this.addressBook.transactingTokenAddress || '', safeTxData.from || this.web3.eth.accounts[0]);
    let plan = await this.volumeSubscriptionWrapper.getPlan(planHash);
    if (balance.toNumber() < plan.amount.toNumber()) {
      throw("The user does not have enough funds in their wallet");
    }

    if (plan.owner == (safeTxData.from || this.web3.eth.accounts[0])) {
      throw("You cannot subscribe to your own plan");
    }

    return this.volumeSubscriptionWrapper.createSubscription(
      planHash,
      metaData,
      txData
    );

  }

  /**
   * Activate
   *
   * Makes first payment. This function can only be called once a user has subscribed to a subscription plan.
   * Provided that a user has subscribed and given authorisation to 8x, the activate function can be called
   * by any user. We're still exploring the best way to lock this down while still providing enough flexibility.
   *
   *
   * @param subscriptionHash    Unique subscription hash returned upon subscribing.
   * @param txData              Provide signer, gas and gasPrice information (optional).
   *
   * @returns                   Hash of the transaction upon completion.
   * @priority                  4
   *
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
   * Get a subscription using the subscription hash.
   *
   * @param subscriptionHash  Unique subscription hash returned upon subscribing.
   *
   * @response
   * ```
   * {
   *    owner: '0xdfLqn83...',
   *    tokenAddress: '0xw9s3mfd...',
   *    planHash: '0xwjw93m3sd...',
   *    lastPaymentDate: 155321434, // (epoch in seconds)
   *    terminationDate: 155452222, // (epoch in seconds)
   *    subscriptionHash: '0xhad93d...',
   * }
   * ```
   *
   * @returns                 A subscription object.
   * @priority                5
   *
  */
  public async get(
    subscriptionHash: Bytes32
  ): Promise<Subscription> {

    return this.volumeSubscriptionWrapper.getSubscription(
      subscriptionHash
    );

  }

  /**
   * Get status
   *
   * Determine the current state of a subscription. It can either be 'active', 'processing' or 'inactive'.
   *
   * The processing state is a simply divisor of the interval of your subscription. Suppose the interval divisor is set at 7, then a 28-day subscription has a maximum of 4 days (plus an hour) to be processed.
   *
   * The extra hour is counted in the case a service node doesn't process a subscription and another node on the network can steal their tokens and process your subscription instead.
   *
   * When you call this function, we'll also let you know whether the user has enough tokens to pay for the subscription and if they've revoked authorisation for 8x to take tokens from their wallet.
   *
   * You can decide how you'd like to handle unprocessed subscriptions.
   *
   * @response
   * ```
   * // In the following response, we see the status of a user who's subscription is being processed but has a low chance of not fulfilling their recurring obligation.
   * [
   *    'processing', // The subscription is being processed
   *    'true', // The user has enough tokens to pay for the subscription
   *    'true', // The user has given 8x enough allowance to take tokens from their wallet
   * ]
   * ```
   *
   * @param subscriptionHash        Unique subscription hash returned upon subscribing.
   * @returns                       Current status, does user has enough tokens, does 8x got authorisation.
   * @priority                      6
   *
   */
  public async getStatus(
    subscriptionHash: Bytes32
  ): Promise<[string, boolean, boolean]> {

    let subscription = await this.get(subscriptionHash);

    let planHash = subscription.planHash;

    let plan = await this.volumeSubscriptionWrapper.getPlan(planHash)

    const intervalDivisor = await this.executorWrapper.getIntervalDivisor();
    const now = Date.now() / 1000;
    const dueDate = subscription.lastPaymentDate + plan.interval;

    const userBalance = await this.tokenWrapper.balanceOf(plan.tokenAddress, subscription.owner);
    const hasEnough = userBalance >= plan.amount;

    let allowanceAmount = await this.tokenWrapper.allowance(
      plan.tokenAddress,
      subscription.owner,
      this.addressBook.transferProxyAddress || ''
    );

    const permissionGranted = allowanceAmount >= plan.amount;

    // If we're before the payment date, happy days.
    if (now < dueDate && subscription.terminationDate === 0) {
      return ['active', hasEnough, permissionGranted];
    }

    // The subscription is being processed, plus give an extra hour for someone to catch out
    if (now < dueDate + (plan.interval / intervalDivisor.toNumber()) + (60 * 60) && subscription.terminationDate === 0) {
      return ['processing', hasEnough, permissionGranted];
    }

    return ['inactive', hasEnough, permissionGranted];

  }

  /**
   * All subscriptions
   *
   * Get all the subscriptions a user has subscribed to..
   *
   * @param user       The user you'd like to get subscriptions for.
   *
   * @returns          An array of subscription objects.
   * @priority         7
   *
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
   * @returns                   Hash of the transaction upon completion.
   * @priority                  8
   *
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