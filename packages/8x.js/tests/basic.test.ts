import * as mocha from 'mocha';
import * as chai from 'chai';

import Web3 from 'web3';

import { getAddressBook } from 'artifacts';
import EightEx from '../src';

const expect = chai.expect;
const addressBook = getAddressBook('development');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const eightEx = new EightEx(web3, addressBook);

describe('Plans', () => {

  beforeEach(async () => {

    let result = await web3.eth.accounts.create();
    console.log(result);

    let identifier = await eightEx.plans.create(
      result.address,
      addressBook.daiAddress || '',
      "new.plan",
      30*(24*60*60),
      10*10**18,
      10**17,
      ""
    );

    console.log(identifier);

  });

  it('should be able to create a plan', async () => {
    expect(true).to.be.true;
  });

});