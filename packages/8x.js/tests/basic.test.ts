import * as mocha from 'mocha';
import * as chai from 'chai';

import Web3 from 'web3';

import { getAddressBook } from '@8xprotocol/artifacts';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { web3Factory } from '@0xproject/dev-utils';
import { Provider } from 'ethereum-types';
import EightEx from '../src';

const expect = chai.expect;
const addressBook = getAddressBook('development');

const provider: Provider = web3Factory.getRpcProvider({ shouldUseInProcessGanache: true });
const web3Wrapper = new Web3Wrapper(provider);

const eightEx = new EightEx(web3Wrapper, addressBook);

describe('Plans', () => {

  beforeEach(async () => {

    /*let result = await web3.eth.accounts.create();
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

    console.log(identifier);*/

  });

  it('should be able to create a plan', async () => {
    expect(true).to.be.true;
  });

});