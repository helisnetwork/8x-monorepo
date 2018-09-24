
import * as Web3 from 'web3';
import * as contract from 'truffle-contract';

import { Provider, TxData } from 'ethereum-types';
import { BigNumber } from 'bignumber.js';
import { Address } from '@8xprotocol/types';

import {
  ApprovedRegistryAbi,
  ApprovedRegistryContract,
  VolumeSubscriptionAbi,
  VolumeSubscriptionContract,
  MockTokenContract,
  MockTokenAbi,
  MockKyberNetworkAbi,
  MockKyberNetworkContract,
  TransferProxyAbi,
  TransferProxyContract,
  PaymentRegistryAbi,
  PaymentRegistryContract,
  RequirementsAbi,
  RequirementsContract,
  StakeContract,
  ExecutorAbi,
  ExecutorContract,
  StakeContractAbi
} from '@8xprotocol/artifacts';

export const DEFAULT_GAS_LIMIT: BigNumber = new BigNumber(6712390); // Default of 6.7 million gas
export const DEFAULT_GAS_PRICE: BigNumber = new BigNumber(6000000000); // 6 gEei

export function TX_DEFAULTS(from: string) {
  return {
    from: from,
    gasPrice: DEFAULT_GAS_PRICE,
    gas: DEFAULT_GAS_LIMIT
  }
};

export const deployVolumeSubscription = async (
  provider: Provider,
  owner: Address,
  approvedRegistry: Address
): Promise<VolumeSubscriptionContract> => {

  const web3 = new Web3(provider);
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
): Promise<MockKyberNetworkContract> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let mockKyberContract = contract(MockKyberNetworkAbi);
  mockKyberContract.setProvider(provider);
  mockKyberContract.setNetwork(50);
  mockKyberContract.defaults(defaults);

  const deployedKyberContract = await mockKyberContract.new();

  const contractInstance = await MockKyberNetworkContract.at(
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

export const deployExecutor = async(
  provider: Provider,
  owner: Address,
  transferProxyInstance: TransferProxyContract,
  stakeContractInstance: StakeContract,
  paymentRegistryInstance: PaymentRegistryContract,
  volumeSubscriptionInstance: VolumeSubscriptionContract,
  approvedRegistry: Address,
  requirements: Address,
  lockUp: number,
  divisor: number
) => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let executorContract = contract(ExecutorAbi);
  executorContract.setProvider(provider);
  executorContract.setNetwork(50);
  executorContract.defaults(defaults);

  const deployedExecutor = await executorContract.new(
    transferProxyInstance.address,
    stakeContractInstance.address,
    paymentRegistryInstance.address,
    approvedRegistry,
    requirements,
    new BigNumber(lockUp),
    new BigNumber(divisor),
  );

  const executorInstance = await ExecutorContract.at(
    deployedExecutor.address,
    web3,
    defaults
  );

  await transferProxyInstance.addAuthorizedAddress.sendTransactionAsync(
    executorInstance.address,
    defaults
  );

  await stakeContractInstance.addAuthorizedAddress.sendTransactionAsync(
    executorInstance.address,
    defaults
  );

  await paymentRegistryInstance.addAuthorizedAddress.sendTransactionAsync(
    executorInstance.address,
    defaults
  );

  await volumeSubscriptionInstance.addAuthorizedAddress.sendTransactionAsync(
    executorInstance.address,
    defaults
  );

  return executorInstance;
}

export const deployTransferProxy = async(
  provider: Provider,
  owner: Address
) => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let transferProxyContract = contract(TransferProxyAbi);
  transferProxyContract.setProvider(provider);
  transferProxyContract.setNetwork(50);
  transferProxyContract.defaults(defaults);

  const deployedTransferProxy = await transferProxyContract.new();

  const transferProxyInstance = await TransferProxyContract.at(
    deployedTransferProxy.address,
    web3,
    defaults
  );

  return transferProxyInstance;

}

export const deployStakeContract = async(
  provider: Provider,
  owner: Address,
  stakeToken: Address
) => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let stakeContract = contract(StakeContractAbi);
  stakeContract.setProvider(provider);
  stakeContract.setNetwork(50);
  stakeContract.defaults(defaults);

  const deployedStakeContract = await stakeContract.new(stakeToken);

  const stakeContractInstance = await StakeContract.at(
    deployedStakeContract.address,
    web3,
    defaults
  );

  return stakeContractInstance;
}

export const deployPaymentRegistry = async(
  provider: Provider,
  owner: Address
) => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let paymentsRegistyContract = contract(PaymentRegistryAbi);
  paymentsRegistyContract.setProvider(provider);
  paymentsRegistyContract.setNetwork(50);
  paymentsRegistyContract.defaults(defaults);

  const deployedPaymentRegistry = await paymentsRegistyContract.new();

  const paymentRegistryInstance = await PaymentRegistryContract.at(
    deployedPaymentRegistry.address,
    web3,
    defaults
  );

  return paymentRegistryInstance;

}

export const deployRequirements = async(
  provider: Provider,
  owner: Address
) => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let requirementsContract = contract(RequirementsAbi);
  requirementsContract.setProvider(provider);
  requirementsContract.setNetwork(50);
  requirementsContract.defaults(defaults);

  const deployedRequirementsContract = await requirementsContract.new();

  const requirementsContractInstance = await RequirementsContract.at(
    deployedRequirementsContract.address,
    web3,
    defaults
  );

  return requirementsContractInstance;

}

export const deployMockToken = async(
  provider: Provider,
  owner: Address
): Promise<MockTokenContract> => {

  const web3 = new Web3(provider);
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