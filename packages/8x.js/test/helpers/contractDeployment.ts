
import * as Web3 from 'web3';
import * as contract from 'truffle-contract';

import { Provider, TxData } from 'ethereum-types';
import { BigNumber } from 'bignumber.js';
import { TX_DEFAULTS } from '../../src/constants'
import { Address } from '@8xprotocol/types';

import {
  VolumeSubscriptionContract,
  VolumeSubscriptionAbi
} from '@8xprotocol/artifacts';

export const deployVolumeSubscription = async (
  provider: Provider,
  owner: Address
): Promise<VolumeSubscriptionContract> => {

  const web3 = new Web3(provider);
  const accounts = web3.eth.accounts;
  const defaults = TX_DEFAULTS(owner);

  let volumeSubscriptionContract = contract(VolumeSubscriptionAbi);
  volumeSubscriptionContract.setProvider(provider);
  volumeSubscriptionContract.setNetwork(50);
  volumeSubscriptionContract.defaults(defaults);

  const deployedVolumeSubscription = await volumeSubscriptionContract.new();

  const contractAt = await VolumeSubscriptionContract.at(
    deployedVolumeSubscription.address,
    web3,
    defaults
  );

  return contractAt;

};