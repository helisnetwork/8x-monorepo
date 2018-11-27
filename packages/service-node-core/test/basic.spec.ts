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
  StakeContract,
  PaymentRegistryContract,
  MockTokenContract,
  TransferProxyContract
} from '@8xprotocol/artifacts';

import {
  deployVolumeSubscription,
  deployKyber,
  deployApprovedRegistry,
  deployMockToken,
  deployExecutor,
  deployTransferProxy,
  deployStakeContract,
  deployPaymentRegistry,
  TX_DEFAULTS,
} from '@8xprotocol/dev-utils';

import EightEx from '8x.js';
import Repeater from '../src/';

import { AddressBook } from '@8xprotocol/types';
import { PayrollSubscriptionContract } from '@8xprotocol/artifacts/src';
import { deployPayrollSubscription } from '@8xprotocol/dev-utils/src';

const exepect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const web3Utils = new Web3Utils(web3);

let contractOwner: string;
let business: string;
let consumer: string;
let serviceNode: string;

let topUpAmount = new BigNumber(100);

let eightEx: EightEx;
let repeater: Repeater;
let addressBook: AddressBook;

let volumeSubscription: VolumeSubscriptionContract;
let approvedRegistry: ApprovedRegistryContract;
let mockToken: MockTokenContract;
let stakeToken: MockTokenContract;
let transferProxy: TransferProxyContract;
let executor: ExecutorContract;
let stakeContract: StakeContract;
let payrollSubscription: PayrollSubscriptionContract;
let paymentRegistry: PaymentRegistryContract;

let planHash: string;
let anotherPlanHash: string;
let subscriptionHash: string;

let mockUpdate: jest.Mock<{}>;
let currentSnapshotId: number;

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
    stakeContract = await deployStakeContract(provider, contractOwner, stakeToken.address);
    paymentRegistry = await deployPaymentRegistry(provider, contractOwner);
    payrollSubscription = await deployPayrollSubscription(provider, contractOwner, approvedRegistry.address);

    executor = await deployExecutor(
      provider,
      contractOwner,
      transferProxy,
      stakeContract,
      paymentRegistry,
      volumeSubscription,
      approvedRegistry.address,
      1,
      payrollSubscription
    );

    addressBook = {
      volumeSubscriptionAddress: volumeSubscription.address,
      transactingTokenAddress: mockToken.address,
      approvedRegistryAddress: approvedRegistry.address,
      executorAddress: executor.address,
      transferProxyAddress: transferProxy.address,
      payrollSubscriptionAddress: payrollSubscription.address
    };

    eightEx = new EightEx(web3, addressBook);

    repeater = new Repeater(web3, addressBook, serviceNode, {
      processing: 0,
      catchLate: 5,
      stopChecking: 10
    });

    await approvedRegistry.addApprovedContract.sendTransactionAsync(volumeSubscription.address, {from: contractOwner});
    await approvedRegistry.addApprovedContract.sendTransactionAsync(payrollSubscription.address, {from: contractOwner});

    await mockToken.transfer.sendTransactionAsync(consumer, new BigNumber(50*10**18), {from: contractOwner});
    await mockToken.transfer.sendTransactionAsync(business, new BigNumber(50*10**18), {from: contractOwner});
    await stakeToken.transfer.sendTransactionAsync(serviceNode, topUpAmount, {from: contractOwner});

    await repeater.attemptTopUp(topUpAmount, mockToken.address, stakeToken.address, stakeContract.address);
    await repeater.attemptTopUp(topUpAmount, mockToken.address, stakeToken.address, stakeContract.address);

    await repeater.start();

    planHash = await eightEx.plans.create(
      business,
      'create.new.plan',
      2,
      new BigNumber(10*10**18),
      new BigNumber(10**16),
      'Netflix',
      'Premium Plan',
      'http://some.cool.image',
      null,
      {from: business},
    );

    await eightEx.subscriptions.giveAuthorisation({from: consumer});
    await eightEx.subscriptions.giveAuthorisation({from: business});

  });

  test('scheduled payroll', async () => {

    let now = await web3Utils.getCurrentBlockTime();
    let paymentHash = '0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c10';
    
    await new Promise((resolve, reject) => {
      repeater.repeaterUpdated = () => {
        if (!repeater.payrollStore.payments[paymentHash]) {
          return;
        }

        if (repeater.payrollStore.payments[paymentHash].lastPaymentDate == 0) {
          return;
        }
          
        expect(repeater.payrollStore.payments[paymentHash].paymentIdentifier).toEqual(paymentHash);
        resolve();
      };

      payrollSubscription.createScheduleWithPayments.sendTransactionAsync(
        [paymentHash],
        [new BigNumber(10*10**18)],
        [consumer],
        mockToken.address,
        new BigNumber(now + 1),
        new BigNumber(10),
        new BigNumber(100),
        true,
        '',
        null
      );
    });

  })

  test('activate subscription', async () => {

    subscriptionHash = await eightEx.subscriptions.subscribe(planHash, null, {from: consumer});

    await new Promise((resolve, reject) => {
      repeater.repeaterUpdated = () => {
        expect(repeater.executorStore.events[subscriptionHash].paymentIdentifier).toEqual(subscriptionHash);
        resolve();
      };

      eightEx.subscriptions.activate(subscriptionHash, {from: consumer});
    });

  });

  test('processing subscription', async() => {

    let paymentInformation = await paymentRegistry.getPaymentInformation.callAsync(subscriptionHash);
    let now = await web3Utils.getCurrentBlockTime();

    let delay = Math.floor(paymentInformation["1"].toNumber() - (now) + 1);
    
    setTimeout(null, delay);

    await new Promise((resolve, reject) => {
      repeater.repeaterUpdated = () => {
        expect(repeater.executorStore.events[subscriptionHash].paymentIdentifier).toEqual(subscriptionHash);
        expect(repeater.executorStore.events[subscriptionHash].claimant).toEqual(serviceNode);
        resolve();
      };
    });

  });

  test('processing subscription (again)', async() => {

    let paymentInformation = await (paymentRegistry.getPaymentInformation.callAsync(subscriptionHash));
    let now = await web3Utils.getCurrentBlockTime();

    let delay = Math.floor(paymentInformation["1"].toNumber() - (now) + 1);
    setTimeout(null, delay);

    await new Promise((resolve, reject) => {
      repeater.repeaterUpdated = () => {
        expect(repeater.executorStore.events[subscriptionHash].paymentIdentifier).toEqual(subscriptionHash);
        expect(repeater.executorStore.events[subscriptionHash].claimant).toEqual(serviceNode);
        resolve();
      };
    });

  });

});