'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';
import * as Units from '../src/utils/units';

import { BigNumber } from 'bignumber.js';
import { Web3Utils, VolumeSubscriptionContract } from '@8xprotocol/artifacts';

import {
  deployVolumeSubscription, deployKyber, deployApprovedRegistry, deployMockToken
} from './helpers/contract_deployment';

import EightEx from '../src/index';
import { TX_DEFAULTS } from '../src/constants';

const expect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

let contractOwner: string;
let business: string;
let consumer: string;

let eightEx: EightEx;

let volumeSubscription: VolumeSubscriptionContract;
let planHash: string;
let subscriptionHash: string;

describe('SubscriptionAPI', () => {

  beforeAll(async () => {

    let addresses = web3.eth.accounts;
    contractOwner = addresses[0]
    business = addresses[1];
    consumer = addresses[2];

    const mockToken = await deployMockToken(provider, contractOwner);
    const kyber = await deployKyber(provider, contractOwner);
    const approvedRegistry = await deployApprovedRegistry(provider, contractOwner, kyber.address, mockToken.address);

    volumeSubscription = await deployVolumeSubscription(provider, contractOwner, approvedRegistry.address);

    eightEx = new EightEx(web3, {
      volumeSubscriptionAddress: volumeSubscription.address,
      daiAddress: mockToken.address,
      approvedRegistryAddress: approvedRegistry.address
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

  });

  test('should be able to create a subscription', async () => {

    subscriptionHash = await eightEx.subscriptions.create(
      planHash,
      '',
      {from: consumer}
    );

    console.log(subscriptionHash);
    expect(subscriptionHash).to.not.be.null;

  });

  test('should be able to activate a subscription', async () => {

  });

});