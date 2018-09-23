import Web3 = require("web3");

import * as contract from 'truffle-contract';

import { Provider, TxData } from 'ethereum-types';
import { BigNumber } from 'bignumber.js';
import { Address } from '@8xprotocol/types';

import {
  ApprovedRegistryAbi,
  VolumeSubscriptionAbi,
  MockTokenAbi,
  MockKyberNetworkAbi,
  TransferProxyAbi,
  PaymentRegistryAbi,
  RequirementsAbi,
  ExecutorAbi,
  StakeContractAbi,
} from '@8xprotocol/artifacts';

import { VolumeSubscription } from '../../build/VolumeSubscription';
import { Executor } from '../../build/Executor';
import { MockKyberNetwork } from '../../build/MockKyberNetwork';
import { ApprovedRegistry } from '../../build/ApprovedRegistry';
import { TransferProxy } from '../../build/TransferProxy';
import { Requirements } from '../../build/Requirements';
import { StakeContract } from '../../build/StakeContract';
import { PaymentRegistry } from '../../build/PaymentRegistry';
import { MockToken } from '../../build/MockToken';

export const deployVolumeSubscription = async (
  provider: any,
  owner: Address,
  approvedRegistry: Address
): Promise<VolumeSubscription> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let volumeSubscriptionContract = contract(VolumeSubscriptionAbi);
  volumeSubscriptionContract.setProvider(provider);
  volumeSubscriptionContract.setNetwork(50);
  volumeSubscriptionContract.defaults(defaults);

  const deployedVolumeSubscription = await volumeSubscriptionContract.new(approvedRegistry);

  const contractInstance = new VolumeSubscription(
    VolumeSubscriptionAbi.abi,
    deployedVolumeSubscription.address
  );

  return contractInstance;

};

export const deployKyber = async(
  provider: any,
  owner: Address
): Promise<MockKyberNetwork> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let mockKyberContract = contract(MockKyberNetworkAbi);
  mockKyberContract.setProvider(provider);
  mockKyberContract.setNetwork(50);
  mockKyberContract.defaults(defaults);

  const deployedKyberContract = await mockKyberContract.new();

  const contractInstance = new MockKyberNetwork(
    MockKyberNetworkAbi.abi,
    deployedKyberContract.address
  );

  return contractInstance;

}

export const deployApprovedRegistry = async(
  provider: any,
  owner: Address,
  kyber: Address,
  token: Address
): Promise<ApprovedRegistry> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let approvedRegistryContract = contract(ApprovedRegistryAbi);
  approvedRegistryContract.setProvider(provider);
  approvedRegistryContract.setNetwork(50);
  approvedRegistryContract.defaults(defaults);

  const deployedApprovedRegistry = await approvedRegistryContract.new(kyber);

  const contractInstance = new ApprovedRegistry(
    ApprovedRegistryAbi.abi,
    deployedApprovedRegistry.address
  );

  await contractInstance.methods.addApprovedToken(
    token,
    false,
  ).call({
    from: defaults.from,
    gas: defaults.gas.toNumber(),
    gasPrice: defaults.gasPrice.toNumber()
  })

  return contractInstance;

}

export const deployExecutor = async(
  provider: any,
  owner: Address,
  transferProxyInstance: TransferProxy,
  stakeContractInstance: StakeContract,
  paymentRegistryInstance: PaymentRegistry,
  volumeSubscriptionInstance: VolumeSubscription,
  approvedRegistry: Address,
  requirements: Address,
  lockUp: number,
  divisor: number
): Promise<Executor> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let executorContract = contract(ExecutorAbi);
  executorContract.setProvider(provider);
  executorContract.setNetwork(50);
  executorContract.defaults(defaults);

  const deployedExecutor = await executorContract.new(
    transferProxyInstance.options.address,
    stakeContractInstance.options.address,
    paymentRegistryInstance.options.address,
    approvedRegistry,
    requirements,
    new BigNumber(lockUp),
    new BigNumber(divisor),
  );

  const executorInstance = new Executor(
    ExecutorAbi.abi,
    deployedExecutor.address,
  );

  await transferProxyInstance.methods.addAuthorizedAddress(
    executorInstance.options.address,
  ).send({
    from: defaults.from,
    gas: defaults.gas.toNumber(),
    gasPrice: defaults.gasPrice.toNumber()
  })

  await stakeContractInstance.methods.addAuthorizedAddress(
    executorInstance.options.address,
  ).send({
    from: defaults.from,
    gas: defaults.gas.toNumber(),
    gasPrice: defaults.gasPrice.toNumber()
  })

  await paymentRegistryInstance.methods.addAuthorizedAddress(
    executorInstance.options.address,
  ).send({
    from: defaults.from,
    gas: defaults.gas.toNumber(),
    gasPrice: defaults.gasPrice.toNumber()
  })

  await volumeSubscriptionInstance.methods.addAuthorizedAddress(
    executorInstance.options.address,
  ).send({
    from: defaults.from,
    gas: defaults.gas.toNumber(),
    gasPrice: defaults.gasPrice.toNumber()
  })

  return executorInstance;
}

export const deployTransferProxy = async(
  provider: any,
  owner: Address
): Promise<TransferProxy> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let transferProxyContract = contract(TransferProxyAbi);
  transferProxyContract.setProvider(provider);
  transferProxyContract.setNetwork(50);
  transferProxyContract.defaults(defaults);

  const deployedTransferProxy = await transferProxyContract.new();

  const transferProxyInstance = new TransferProxy(
    TransferProxyAbi.abi,
    deployedTransferProxy.address,
  );

  return transferProxyInstance;

}

export const deployStakeContract = async(
  provider: any,
  owner: Address
): Promise<StakeContract> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let stakeContract = contract(StakeContractAbi);
  stakeContract.setProvider(provider);
  stakeContract.setNetwork(50);
  stakeContract.defaults(defaults);

  const deployedStakeContract = await stakeContract.new();

  const stakeContractInstance = new StakeContract(
    StakeContractAbi.abi,
    deployedStakeContract.address
  );

  return stakeContractInstance;
}

export const deployPaymentRegistry = async(
  provider: any,
  owner: Address
): Promise<PaymentRegistry> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let paymentsRegistyContract = contract(PaymentRegistryAbi);
  paymentsRegistyContract.setProvider(provider);
  paymentsRegistyContract.setNetwork(50);
  paymentsRegistyContract.defaults(defaults);

  const deployedPaymentRegistry = await paymentsRegistyContract.new();

  const paymentRegistryInstance = new PaymentRegistry(
    PaymentRegistryAbi.abi,
    deployedPaymentRegistry.address
  );

  return paymentRegistryInstance;

}

export const deployRequirements = async(
  provider: any,
  owner: Address
): Promise<Requirements> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let requirementsContract = contract(RequirementsAbi);
  requirementsContract.setProvider(provider);
  requirementsContract.setNetwork(50);
  requirementsContract.defaults(defaults);

  const deployedRequirementsContract = await requirementsContract.new();

  const requirementsContractInstance = new Requirements(
    PaymentRegistryAbi.abi,
    deployedRequirementsContract.address
  );

  return requirementsContractInstance;

}

export const deployMockToken = async(
  provider: any,
  owner: Address
): Promise<MockToken> => {

  const web3 = new Web3(provider);
  const defaults = TX_DEFAULTS(owner);

  let mockTokenContract = contract(MockTokenAbi);
  mockTokenContract.setProvider(provider);
  mockTokenContract.setNetwork(50);
  mockTokenContract.defaults(defaults);

  const deployedToken = await mockTokenContract.new();

  const contractInstance = new MockToken(
    MockTokenAbi.abi,
    deployedToken.address
  );

  return contractInstance;

}

export const DEFAULT_GAS_LIMIT: BigNumber = new BigNumber(6712390); // Default of 6.7 million gas
export const DEFAULT_GAS_PRICE: BigNumber = new BigNumber(6000000000); // 6 gEei

function TX_DEFAULTS(from: string) {
  return {
    from: from,
    gasPrice: DEFAULT_GAS_PRICE,
    gas: DEFAULT_GAS_LIMIT
  }
};