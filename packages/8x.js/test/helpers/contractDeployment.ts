import { VolumeSubscriptionContract, VolumeSubscriptionAbi } from '@8xprotocol/artifacts';

import * as Web3 from 'web3';
import * as contract from 'truffle-contract';

import { Provider } from 'ethereum-types';
import { BigNumber } from 'bignumber.js';

export const deployVolumeSubscription = async (
  provider: Provider
): Promise<VolumeSubscriptionContract> => {

  const web3 = new Web3(provider);
  const accounts = web3.eth.accounts;

  let defaults = {
    from: accounts[0],
    gasPrice: new BigNumber(6000000000),
    gas: new BigNumber(6712390),
  };

  let volumeSubscriptionContract = contract(VolumeSubscriptionAbi);
  volumeSubscriptionContract.setProvider(provider);
  volumeSubscriptionContract.setNetwork(50);
  volumeSubscriptionContract.defaults(defaults);

  const deployedVolumeSubscription = await volumeSubscriptionContract.new();

  const contractAt = await VolumeSubscriptionContract.at(
    deployedVolumeSubscription.address,
    web3,
    {},
  );

  return contractAt;

};