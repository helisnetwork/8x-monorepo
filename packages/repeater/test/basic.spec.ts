'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';

import { BigNumber } from 'bignumber.js';
import {
  Web3Utils,
  VolumeSubscriptionContract,
  ApprovedRegistryContract,
  ExecutorContract,
  VolumeSubscriptionAbi,
  ExecutorAbi,
  StakeContract,
  PaymentRegistryContract,
  MockVolumeSubscriptionContract
} from '@8xprotocol/artifacts';

import {
  deployVolumeSubscription,
  deployMockVolumeSubscription,
  deployKyber,
  deployApprovedRegistry,
  deployMockToken,
  deployExecutor,
  deployTransferProxy,
  deployStakeContract,
  deployPaymentRegistry,
  deployRequirements,
  TX_DEFAULTS,
} from '@8xprotocol/dev-utils';

import EightEx from '8x.js';
import Repeater from '../src';

import { MockTokenContract, TransferProxyContract } from '@8xprotocol/artifacts';
import { AddressBook } from '@8xprotocol/types';

const exepect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const web3Utils = new Web3Utils(web3);

let contractOwner: string;
let business: string;
let consumer: string;
let serviceNode: string;

let topUpAmount = new BigNumber(100*10**18);

let eightEx: EightEx;
let addressBook: AddressBook;

let volumeSubscription: VolumeSubscriptionContract;
let approvedRegistry: ApprovedRegistryContract;
let mockToken: MockTokenContract;
let stakeToken: MockTokenContract;
let transferProxy: TransferProxyContract;
let executor: ExecutorContract;
let stakeContract: StakeContract;
let paymentRegistry: PaymentRegistryContract;

let planHash: string;
let anotherPlanHash: string;
let subscriptionHash: string;

let mockUpdate: jest.Mock<{}>;
let currentSnapshotId: number;

describe('Basic', () => {

  beforeEach(async () => {

    //currentSnapshotId = await web3Utils.saveTestSnapshot();

  });

  afterEach(async () => {

    //await web3Utils.revertToSnapshot(currentSnapshotId);

  });

  beforeAll(async () => {

    let addresses = web3.eth.accounts;
    contractOwner = addresses[0]
    business = addresses[1];
    consumer = addresses[2];
    serviceNode = addresses[3];

    const kyber = await deployKyber(provider, contractOwner);

    mockToken = await deployMockToken(provider, contractOwner);
    stakeToken = await deployMockToken(provider, contractOwner);
    approvedRegistry = await deployApprovedRegistry(provider, contractOwner, kyber.address, mockToken.address);
    volumeSubscription = await deployVolumeSubscription(provider, contractOwner, approvedRegistry.address);
    transferProxy = await deployTransferProxy(provider, contractOwner);
    stakeContract = await deployStakeContract(provider, contractOwner, stakeToken.address);
    paymentRegistry = await deployPaymentRegistry(provider, contractOwner);
    const requirements = await deployRequirements(provider, contractOwner);

    executor = await deployExecutor(
      provider,
      contractOwner,
      transferProxy,
      stakeContract,
      paymentRegistry,
      volumeSubscription,
      approvedRegistry.address,
      requirements.address,
      800,
      2
    );

    addressBook = {
      volumeSubscriptionAddress: volumeSubscription.address,
      transactingTokenAddress: mockToken.address,
      approvedRegistryAddress: approvedRegistry.address,
      executorAddress: executor.address,
      transferProxyAddress: transferProxy.address,
    };

    eightEx = new EightEx(web3, addressBook);

    await approvedRegistry.addApprovedContract.sendTransactionAsync(volumeSubscription.address, {from: contractOwner});

    await mockToken.transfer.sendTransactionAsync(consumer, new BigNumber(20*10**18), {from: contractOwner});
    await stakeToken.transfer.sendTransactionAsync(serviceNode, topUpAmount, {from: contractOwner});

    await stakeToken.approve.sendTransactionAsync(
      stakeContract.address,
      topUpAmount,
      {from: serviceNode}
    );

    await stakeContract.topUpStake.sendTransactionAsync(
      topUpAmount,
      mockToken.address,
      {from: serviceNode}
    );

    planHash = await eightEx.plans.create(
      business,
      'create.new.plan',
      6,
      new BigNumber(10*10**18),
      new BigNumber(10**16),
      'Netflix',
      'Premium Plan',
      'http://some.cool.image',
      null,
      {from: business},
    );

  });

  test('activate subscription', async () => {

    await eightEx.subscriptions.giveAuthorisation({from: consumer});

    subscriptionHash = await eightEx.subscriptions.subscribe(planHash, null, {from: consumer});
    await eightEx.subscriptions.activate(subscriptionHash, {from: consumer});

    await new Promise((resolve, reject) => {
      let repeater = new Repeater(addressBook, provider, '', () => {
        expect(repeater.eventStore.events[subscriptionHash].subscriptionIdentifier).toEqual(subscriptionHash);
        resolve();
      });

      repeater.start();
    });

  });

  test('processing subscription', async() => {

    let dueDate = await paymentRegistry.getPaymentInformation.callAsync(subscriptionHash);
    let now = await web3Utils.getCurrentBlockTime();

    let delay = Math.floor(dueDate["1"].toNumber() - (now) + 1);

    await web3Utils.increaseTime(delay);

    await executor.processSubscription.sendTransactionAsync(
      volumeSubscription.address,
      subscriptionHash,
      {from: serviceNode}
    );

    await new Promise((resolve, reject) => {
      let repeater = new Repeater(addressBook, provider, '', () => {
        console.log(repeater.eventStore.events);
        expect(repeater.eventStore.events[subscriptionHash].subscriptionIdentifier).toEqual(subscriptionHash);
        resolve();
      });

      repeater.start();
    });

  });

});