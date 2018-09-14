'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';
import * as contract from 'truffle-contract';

import { BigNumber } from 'bignumber.js';
import { Web3Utils } from '@8xprotocol/artifacts';
import { VolumeSubscriptionContract, VolumeSubscriptionAbi } from '@8xprotocol/artifacts';

import EightEx from '../src/index';

const expect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);
const eightEx = new EightEx(web3, {volumeSubscriptionAddress: '0x26c30dd516003ebe93418945a7a96ad00db5fc42'});

let addresses: string;
let business: string;
let consumer: string;

describe('Plans', () => {

  beforeAll(async () => {

    addresses = web3.eth.accounts;
    business = addresses[0];
    consumer = addresses[1];
    console.log(addresses);

  });

  test('should be able to create a plan', async () => {

    /*let identifier = await eightEx.plans.create(
      business,
      'create.new.plan',
      30,
      1000,
      10,
      'Netflix',
      'Premium Plan',
      null,
      {from: business}
    );

    expect(identifier).to.not.be.null;*/

    let defaults = {
      from: business,
      gasPrice: new BigNumber(6000000000),
      gas: new BigNumber(6712390),
    };

    let vsContract = contract(VolumeSubscriptionAbi);
    vsContract.setProvider(provider);
    vsContract.setNetwork(50);
    vsContract.defaults(defaults);

    const deployedVolumeSubscription = await vsContract.new();
    console.log(deployedVolumeSubscription.address);

    const contractAt = await VolumeSubscriptionContract.at(
      deployedVolumeSubscription.address,
      web3,
      {},
    );

    const a = await contractAt.getGasForExecution.callAsync('', new BigNumber(0));
    console.log(a[0].toNumber(), a[1].toNumber());

  });

});