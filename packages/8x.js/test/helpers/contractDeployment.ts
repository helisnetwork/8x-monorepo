
import * as Web3 from 'web3';
import * as contract from 'truffle-contract';

import { Provider, TxData } from 'ethereum-types';
import { BigNumber } from 'bignumber.js';
import { TX_DEFAULTS } from '../../src/constants'
import { Address } from '@8xprotocol/types';

import {
  ApprovedRegistryAbi,
  ApprovedRegistryContract,
  MockKyberNetworkInterfaceAbi,
  MockKyberNetworkInterfaceContract,
  VolumeSubscriptionAbi,
  VolumeSubscriptionContract,
  MockTokenContract,
  MockTokenAbi
} from '@8xprotocol/artifacts';

export const deployVolumeSubscription = async (
  provider: Provider,
  owner: Address,
  approvedRegistry: Address
): Promise<VolumeSubscriptionContract> => {

  const web3 = new Web3(provider);
  const accounts = web3.eth.accounts;
  const defaults = TX_DEFAULTS(owner);

  let volumeSubscriptionContract = contract(VolumeSubscriptionAbi);
  volumeSubscriptionContract.setProvider(provider);
  volumeSubscriptionContract.setNetwork(50);
  volumeSubscriptionContract.defaults(defaults);

  const deployedVolumeSubscription = await volumeSubscriptionContract.new(approvedRegistry);

  const contractInstance = await VolumeSubscriptionContract.at(
    deployedVolumeSubscription.address,
    web3,
    defaults
  );

  return contractInstance;

};

export const deployKyber = async(
  provider: Provider,
  owner: Address
): Promise<MockKyberNetworkInterfaceContract> => {

  const web3 = new Web3(provider);
  const accounts = web3.eth.accounts;
  const defaults = TX_DEFAULTS(owner);

  let mockKyberContract = contract(MockKyberNetworkInterfaceAbi);
  mockKyberContract.setProvider(provider);
  mockKyberContract.setNetwork(50);
  mockKyberContract.defaults(defaults);

  const deployedKyberContract = await mockKyberContract.new();

  const contractInstance = await MockKyberNetworkInterfaceContract.at(
    deployedKyberContract.address,
    web3,
    defaults
  );

  return contractInstance;

}

export const deployApprovedRegistry = async(
  provider: Provider,
  owner: Address,
  kyber: Address,
  token: Address
): Promise<ApprovedRegistryContract> => {

  const web3 = new Web3(provider);
  const accounts = web3.eth.accounts;
  const defaults = TX_DEFAULTS(owner);

  let approvedRegistryContract = contract(ApprovedRegistryAbi);
  approvedRegistryContract.setProvider(provider);
  approvedRegistryContract.setNetwork(50);
  approvedRegistryContract.defaults(defaults);

  const deployedVolumeSubscription = await approvedRegistryContract.new(kyber);

  const contractInstance = await ApprovedRegistryContract.at(
    deployedVolumeSubscription.address,
    web3,
    defaults
  );

  await contractInstance.addApprovedToken.sendTransactionAsync(
    token,
    false,
    TX_DEFAULTS(owner)
  );

  return contractInstance;

}

export const deployMockToken = async(
  provider: Provider,
  owner: Address
): Promise<MockTokenContract> => {

  const web3 = new Web3(provider);
  const accounts = web3.eth.accounts;
  const defaults = TX_DEFAULTS(owner);

  let mockTokenContract = contract(MockTokenAbi);
  mockTokenContract.setProvider(provider);
  mockTokenContract.setNetwork(50);
  mockTokenContract.defaults(defaults);

  const deployedToken = await mockTokenContract.new();

  const contractInstance = await MockTokenContract.at(
    deployedToken.address,
    web3,
    defaults
  );

  return contractInstance;

}