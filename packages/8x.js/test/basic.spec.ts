'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';

import { BigNumber } from 'bignumber.js';
import { Web3Utils } from '@8xprotocol/artifacts';

import {
  deployVolumeSubscription
} from './helpers/contractDeployment';

import EightEx from '../src/index';

const expect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);
const eightEx = new EightEx(web3, {volumeSubscriptionAddress: '0x26c30dd516003ebe93418945a7a96ad00db5fc42'});

let contractOwner: string;
let business: string;
let consumer: string;

describe('Plans', () => {

  beforeAll(async () => {

    let addresses = web3.eth.accounts;
    contractOwner = addresses[0]
    business = addresses[1];
    consumer = addresses[2];
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

    const contract = await deployVolumeSubscription(provider, contractOwner);
    const result = await contract.getGasForExecution.callAsync('', new BigNumber(0));
    console.log(result[0].toNumber(), result[1].toNumber());

  });

});