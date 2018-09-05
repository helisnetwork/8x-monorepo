import * as mocha from 'mocha';
import * as chai from 'chai';

import Web3 from 'web3';

import { getAddressBook } from 'artifacts';

const expect = chai.expect;
const addressBook = getAddressBook('development');

consol

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

describe('Plans', () => {

  beforeEach(async () => {

  });

  it('should be able to create a plan', async () => {
    expect(true).to.be.true;
  });

});