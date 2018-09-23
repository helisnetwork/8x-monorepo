'use strict';

import 'jest';

import * as chai from 'chai';
import Web3 = require("web3");

import { BigNumber } from 'bignumber.js';

import {
  deployVolumeSubscription,
  deployKyber,
  deployApprovedRegistry,
  deployMockToken,
  deployExecutor,
  deployTransferProxy,
  deployStakeContract,
  deployPaymentRegistry,
  deployRequirements
} from './helpers/contract_deployment';

import { MockToken } from '../build/MockToken';
import { VolumeSubscription } from '../build/VolumeSubscription';
import { ApprovedRegistry } from '../build/ApprovedRegistry';
import { Executor } from '../build/Executor';
import { TransferProxy } from '../build/TransferProxy';

const expect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

let contractOwner: string;
let business: string;
let consumer: string;

let volumeSubscription: VolumeSubscription;
let approvedRegistry: ApprovedRegistry;
let mockToken: MockToken;
let transferProxy: TransferProxy;
let executor: Executor;

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
    approvedRegistry = await deployApprovedRegistry(provider, contractOwner, kyber.options.address, mockToken.options.address);
    volumeSubscription = await deployVolumeSubscription(provider, contractOwner, approvedRegistry.options.address);
    transferProxy = await deployTransferProxy(provider, contractOwner);

    const stakeContract = await deployStakeContract(provider, contractOwner);
    const paymentRegistry = await deployPaymentRegistry(provider, contractOwner);
    const requirements = await deployRequirements(provider, contractOwner);

    executor = await deployExecutor(
      provider,
      contractOwner,
      transferProxy,
      stakeContract,
      paymentRegistry,
      volumeSubscription,
      approvedRegistry.options.address,
      requirements.options.address,
      800,
      7
    );

    await approvedRegistry.methods.addApprovedContract(volumeSubscription.options.address).send({from: contractOwner});
    await mockToken.methods.transfer(consumer, 20*10**18).send({from: contractOwner});

    planHash = await volumeSubscription.methods.createPlan(
      business,
      mockToken.options.address,
      web3.utils.fromAscii('test'),
      30,
      10*10**18,
      10**16,
      ''
    ).send({from: business});

    console.log(planHash);

  });


});