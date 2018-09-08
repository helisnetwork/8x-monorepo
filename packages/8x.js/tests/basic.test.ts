import * as mocha from 'mocha';
import * as chai from 'chai';

import { getAddressBook } from '@8xprotocol/artifacts';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

import {
  RPCSubprovider,
  Web3ProviderEngine,
} from '@0xproject/subproviders';

import EightEx from '../src';

const expect = chai.expect;
const addressBook = getAddressBook('development');

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new RPCSubprovider('http://localhost:8545'));
providerEngine.start();

const web3Wrapper = new Web3Wrapper(providerEngine);
const eightEx = new EightEx(web3Wrapper, addressBook);

let addresses: string[];
let business: string;
let consumer: string;

describe('Plans', () => {

  before(async () => {

    addresses = await web3Wrapper.getAvailableAddressesAsync();
    business = addresses[0];
    consumer = addresses[1];
    console.log(addresses);

  });

  it('should be able to create a plan', async () => {

    let identifier = await eightEx.plans.create(
      business,
      'create.new.plan',
      30,
      1000,
      10,
      'Netflix',
      'Premium Plan',
      null
    );

    expect(identifier).to.not.be.null;

  });

});