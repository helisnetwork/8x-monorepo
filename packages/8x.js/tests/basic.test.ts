import * as mocha from 'mocha';
import * as chai from 'chai';

import { returnConfig } from 'artifacts';
import configToJson from '../src/utils/configToJson';

import Web3 from 'web3';

const expect = chai.expect;
const config = returnConfig('development')
const addressBook = configToJson(config);

console.log(addressBook);

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

describe('Plans', () => {

  beforeEach(async () => {

  });

  it('should be able to create a plan', async () => {
    expect(true).to.be.true;
  });

});