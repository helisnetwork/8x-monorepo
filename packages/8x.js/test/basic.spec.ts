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

describe('Plans', () => {

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

  });

  test('should be able to create a plan', async () => {

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

    console.log(planHash);

    expect(planHash).to.not.be.null;

  });

  it('should be able to retrieve details about the plan', async () => {

    let plan = await eightEx.plans.getPlan(planHash);

    expect(plan.owner).to.equal(business);
    expect(plan.identifier).to.equal('create.new.plan');
    expect(plan.interval).to.equal(30);
    expect(plan.amount.toNumber()).to.equal(Units.dollars(10).toNumber());
    expect(plan.fee.toNumber()).to.equal(Units.cents(10).toNumber());
    expect(plan.name).to.equal('Netflix');
    expect(plan.description).to.equal('Premium Plan');
    expect(plan.imageUrl).to.equal('http://some.cool.image');
    expect(plan.terminationDate).to.equal(0);
  });

  it('should be able to cancel the plan', async () => {

    await eightEx.plans.cancel(planHash, {from: business});

    let plan = await eightEx.plans.getPlan(planHash);
    expect(plan.terminationDate).to.not.be.equal(0);

  });

  it('should be able to get all the business\' plans', async () => {

    let plans = await eightEx.plans.getPlans(business);
    expect(plans.length).to.equal(1);

  });

});