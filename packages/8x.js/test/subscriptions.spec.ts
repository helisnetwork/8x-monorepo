'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';
import * as Units from '../src/utils/units';

import { BigNumber } from 'bignumber.js';
import { Web3Utils, VolumeSubscriptionContract, ApprovedRegistryContract, ExecutorContract } from '@8xprotocol/artifacts';

import {
  TX_DEFAULTS,
  deployVolumeSubscription,
  deployKyber,
  deployApprovedRegistry,
  deployMockToken,
  deployExecutor,
  deployTransferProxy,
  deployStakeContract,
  deployPaymentRegistry,
} from '@8xprotocol/dev-utils';

import EightEx from '../src/index';

import { MockTokenContract, TransferProxyContract } from '@8xprotocol/artifacts';

const expect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

let contractOwner: string;
let business: string;
let consumer: string;

let eightEx: EightEx;

let volumeSubscription: VolumeSubscriptionContract;
let approvedRegistry: ApprovedRegistryContract;
let mockToken: MockTokenContract;
let transferProxy: TransferProxyContract;
let executor: ExecutorContract;

let planHash: string;
let anotherPlanHash: string;
let subscriptionHash: string;

describe('SubscriptionAPI', () => {

  beforeAll(async () => {

    let addresses = web3.eth.accounts;
    contractOwner = addresses[0]
    business = addresses[1];
    consumer = addresses[2];

    const kyber = await deployKyber(provider, contractOwner);

    mockToken = await deployMockToken(provider, contractOwner);
    approvedRegistry = await deployApprovedRegistry(provider, contractOwner, kyber.address, mockToken.address);
    volumeSubscription = await deployVolumeSubscription(provider, contractOwner, approvedRegistry.address);
    transferProxy = await deployTransferProxy(provider, contractOwner);

    const stakeContract = await deployStakeContract(provider, contractOwner, '');
    const paymentRegistry = await deployPaymentRegistry(provider, contractOwner);

    executor = await deployExecutor(
      provider,
      contractOwner,
      transferProxy,
      stakeContract,
      paymentRegistry,
      volumeSubscription,
      approvedRegistry.address,
      7
    );

    await approvedRegistry.addApprovedContract.sendTransactionAsync(volumeSubscription.address, {from: contractOwner});

    eightEx = new EightEx(web3, {
      volumeSubscriptionAddress: volumeSubscription.address,
      transactingTokenAddress: mockToken.address,
      approvedRegistryAddress: approvedRegistry.address,
      executorAddress: executor.address,
      transferProxyAddress: transferProxy.address
    });

    planHash = await eightEx.plans.create(
      business,
      'create.new.plan',
      30,
      Units.dollars(10),
      Units.cents(10),
      'Netflix',
      'Premium Plan',
      'http://some.cool.image',
      null,
      {from: business},
    );

    anotherPlanHash = await eightEx.plans.create(
      business,
      'create.new.plan.2',
      30,
      Units.dollars(10),
      Units.cents(10),
      'Netflix',
      'Gold Plan',
      'http://some.cool.image',
      null,
      {from: business},
    );

  });

  test('should be able to give allownace', async () => {

    await eightEx.subscriptions.giveAuthorisation({from: consumer});

    let allowance = await eightEx.subscriptions.hasGivenAuthorisation(consumer);
    expect(allowance).to.be.true;

  })

  test('should be able to create a subscription', async () => {

    await mockToken.transfer.sendTransactionAsync(consumer, Units.dollars(20), {from: contractOwner});
    subscriptionHash = await eightEx.subscriptions.subscribe(
      planHash,
      null,
      {from: consumer}
    );

    expect(subscriptionHash).to.not.be.null;

  });

  test('should be able to get details about the subscription', async () => {

    let subscription = await eightEx.subscriptions.get(subscriptionHash);
    expect(subscription.planHash).to.equal(planHash);
    expect(subscription.lastPaymentDate).to.equal(0);
    expect(subscription.terminationDate).to.equal(0);

  });

  test('should be able to activate a subscription', async () => {

    await mockToken.transfer.sendTransactionAsync(consumer, Units.dollars(20), {from: contractOwner});
    await eightEx.subscriptions.activate(
      subscriptionHash
    );

    let subscription = await eightEx.subscriptions.get(subscriptionHash);
    expect(subscription.planHash).to.equal(planHash);
    expect(subscription.lastPaymentDate).to.be.greaterThan(0);

  });

  test('it should be able to cancel a subscription', async () => {

    await eightEx.subscriptions.cancel(subscriptionHash, {from: consumer});

    let subscription = await eightEx.subscriptions.get(subscriptionHash);
    expect(subscription.terminationDate).to.be.greaterThan(0);

  });

  test('it should be able to get all subscriptions by subscriber', async () => {

    await mockToken.transfer.sendTransactionAsync(consumer, Units.dollars(20), {from: contractOwner});
    let anotherSubscriptionHash = await eightEx.subscriptions.subscribe(anotherPlanHash, null, {from: consumer});
    await eightEx.subscriptions.activate(anotherSubscriptionHash, {from: consumer});

    let subscriptions = await eightEx.subscriptions.getSubscribed(consumer);
    expect(subscriptions.length).to.equal(2);

  });

  test('it should be able to get all subscriptions by plan', async ()=> {

    let subscriptionsOne = await eightEx.plans.getSubscribers(planHash);
    expect(subscriptionsOne.length).to.equal(1);

    let subscriptionsTwo = await eightEx.plans.getSubscribers(anotherPlanHash);
    expect(subscriptionsTwo.length).to.equal(1);

  });

  test('should show active on an activated subscription', async ()=> {

    await mockToken.transfer.sendTransactionAsync(consumer, Units.dollars(20), {from: contractOwner});
    await eightEx.subscriptions.giveAuthorisation({from: consumer});
    let allowance = await eightEx.subscriptions.hasGivenAuthorisation(consumer);
    expect(allowance).to.be.true;

    let subscriptionHash = await eightEx.subscriptions.subscribe(planHash, null, {from: consumer});
    let activation = await eightEx.subscriptions.activate(subscriptionHash, {from: consumer});
    expect(subscriptionHash).to.not.equal(null);
    expect(activation).to.not.equal(null);

    let subscriptionPaymentTest = await eightEx.subscriptions.getStatus(subscriptionHash);
    expect(subscriptionPaymentTest[0]).to.equal('active');

  });

  test('should show inactive on a subscription that has not been activated', async ()=> {
    await mockToken.transfer.sendTransactionAsync(consumer, Units.dollars(20), {from: contractOwner});
    await eightEx.subscriptions.giveAuthorisation({from: consumer});
    let allowance = await eightEx.subscriptions.hasGivenAuthorisation(consumer);
    expect(allowance).to.be.true;

    let subscriptionHash = await eightEx.subscriptions.subscribe(planHash, null, {from: consumer});
    expect(subscriptionHash).to.not.equal(null);

    let subscriptionNotActivatedTest = await eightEx.subscriptions.getStatus(subscriptionHash);
    expect(subscriptionNotActivatedTest[0]).to.equal('inactive');

  });

  test('should show inactive on a cancelled subscription', async ()=> {
    await mockToken.transfer.sendTransactionAsync(consumer, Units.dollars(20), {from: contractOwner});
    await eightEx.subscriptions.giveAuthorisation({from: consumer});
    let allowance = await eightEx.subscriptions.hasGivenAuthorisation(consumer);
    expect(allowance).to.be.true;

    let subscriptionHash = await eightEx.subscriptions.subscribe(planHash, null, {from: consumer});
    let activation = await eightEx.subscriptions.activate(subscriptionHash, {from: consumer});
    expect(subscriptionHash).to.not.equal(null);
    expect(activation).to.not.equal(null);

    await eightEx.subscriptions.cancel(subscriptionHash, {from: consumer});

    let subscriptionCancelledTest = await eightEx.subscriptions.getStatus(subscriptionHash);
    expect(subscriptionCancelledTest[0]).to.equal('inactive');

  });

  test('should be able to create a subscription hash using salt', async ()=> {

  });

});