import * as mocha from 'mocha';
import * as chai from 'chai';

import { getAddressBook, VolumeSubscriptionContract, VolumeSubscriptionJson, ApprovedRegistryContract, ApprovedRegistryJson } from '@8xprotocol/artifacts';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { devConstants } from '@0xproject/dev-utils';

import {
  GanacheSubprovider,
  Web3ProviderEngine,
  RPCSubprovider
} from '@0xproject/subproviders';

import EightEx from '../src';
import { ContractArtifact } from '@8xprotocol/artifacts/node_modules/ethereum-types';

const expect = chai.expect;
const addressBook = getAddressBook('kovan');

const txDefaults = {
    from: devConstants.TESTRPC_FIRST_ADDRESS,
    gas: devConstants.GAS_LIMIT,
};

const provider = new Web3ProviderEngine();

/*
provider.addProvider(
  new GanacheSubprovider({
      gasLimit: 500000,
      logger: {log: (arg: any) => { console.log(`${arg}\n`) }},
      verbose: true,
      port: 8545,
      network_id: 50,
      mnemonic: 'concert load couple harbor equip island argue ramp clarify fence smart topic',
  }),
);*/

provider.addProvider(
  new RPCSubprovider('https://kovan.infura.io/v3/8b5b4dfee44249a992d576ca6ab905ce')
);

provider.start();

const web3Wrapper = new Web3Wrapper(provider);
const eightEx = new EightEx(web3Wrapper, addressBook);

let addresses: string[];
let business: string;
let consumer: string;

describe('Plans', () => {

  before(async () => {

    //await ApprovedRegistryContract.deployFrom0xArtifactAsync(ApprovedRegistryJson as Contract, provider, txDefaults, '');
    // await VolumeSubscriptionContract.deployFrom0xArtifactAsync(VolumeSubscriptionJson as ContractArtifact, provider, txDefaults, '');

    let a = await web3Wrapper.doesContractExistAtAddressAsync(addressBook.volumeSubscriptionAddress || '');

    console.log("EXISTS AT " + a);

    addresses = await web3Wrapper.getAvailableAddressesAsync();
    business = addresses[0];
    consumer = addresses[1];
    console.log(addresses);

  });

  it('should be able to create a plan', async () => {

    /*let identifier = await eightEx.plans.create(
      business,
      'create.new.plan',
      30,
      1000,
      10,
      'Netflix',
      'Premium Plan',
      null,
      txDefaults
    );

    expect(identifier).to.not.be.null;*/

  });

});