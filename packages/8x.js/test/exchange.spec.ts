'use strict';

import 'jest';

import * as chai from 'chai';
import * as Web3 from 'web3';
import * as Units from '../src/utils/units';

import { BigNumber } from 'bignumber.js';
import { Web3Utils, VolumeSubscriptionContract } from '@8xprotocol/artifacts';

import {
  deployVolumeSubscription,
  deployKyber,
  deployApprovedRegistry,
  deployMockToken
} from './helpers/contract_deployment';

import EightEx from '../src/index';
import { TX_DEFAULTS } from '../src/constants';
import { MockTokenContract } from '@8xprotocol/artifacts/dist/build/wrappers/mock_token';
import { MockKyberNetworkInterfaceContract } from '@8xprotocol/artifacts/dist/build/wrappers/mock_kyber_network_interface';

const expect = chai.expect;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

let contractOwner: string;
let user: string;

let eightEx: EightEx;
let mockToken: MockTokenContract;
let kyber: MockKyberNetworkInterfaceContract;

describe('ExchangeAPI', () => {

  beforeAll(async () => {

    let addresses = web3.eth.accounts;
    contractOwner = addresses[0]
    user = addresses[1];

    const mockToken = await deployMockToken(provider, contractOwner);
    const kyber = await deployKyber(provider, contractOwner);

    eightEx = new EightEx(web3, {
      daiAddress: mockToken.address,
    });

  });

  test('should be able to get the exchange rate', async () => {

  });

});