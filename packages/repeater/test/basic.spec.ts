'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';

import { BigNumber } from 'bignumber.js';
import { Web3Utils, VolumeSubscriptionContract, ApprovedRegistryContract, ExecutorContract, VolumeSubscriptionAbi, ExecutorAbi } from '@8xprotocol/artifacts';

import {
  deployVolumeSubscription,
  deployKyber,
  deployApprovedRegistry,
  deployMockToken,
  deployExecutor,
  deployTransferProxy,
  deployStakeContract,
  deployPaymentRegistry,
  deployRequirements,
  TX_DEFAULTS,
} from './helpers/contract_deployment';

import EightEx from '8x.js';
import Repeater from '../src';

import { MockTokenContract, TransferProxyContract } from '@8xprotocol/artifacts';
import { AddressBook } from '@8xprotocol/types';

const exepect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

let contractOwner: string;
let business: string;
let consumer: string;
let serviceNode: string;

let eightEx: EightEx;
let addressBook: AddressBook;

let volumeSubscription: VolumeSubscriptionContract;
let approvedRegistry: ApprovedRegistryContract;
let mockToken: MockTokenContract;
let stakeToken: MockTokenContract;
let transferProxy: TransferProxyContract;
let executor: ExecutorContract;

let planHash: string;
let anotherPlanHash: string;
let subscriptionHash: string;

let mockUpdate: jest.Mock<{}>;

describe('Basic', () => {

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

    const stakeContract = await deployStakeContract(provider, contractOwner, stakeToken.address);
    const paymentRegistry = await deployPaymentRegistry(provider, contractOwner);
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
      7
    );

    await approvedRegistry.addApprovedContract.sendTransactionAsync(volumeSubscription.address, {from: contractOwner});
    await mockToken.transfer.sendTransactionAsync(consumer, new BigNumber(20*10**18), {from: contractOwner});
    await stakeToken.transfer.sendTransactionAsync(serviceNode, new BigNumber(100*10**18), {from: contractOwner});

    addressBook = {
      volumeSubscriptionAddress: volumeSubscription.address,
      transactingTokenAddress: mockToken.address,
      approvedRegistryAddress: approvedRegistry.address,
      executorAddress: executor.address,
      transferProxyAddress: transferProxy.address,
    };

    eightEx = new EightEx(web3, addressBook);

    planHash = await eightEx.plans.create(
      business,
      'create.new.plan',
      30,
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

  });

});