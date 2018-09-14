'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
import { promisify } from '@0xproject/utils';
import { BigNumber } from 'bignumber.js';

import * as Web3 from 'web3';

import { Executor as ContractArtifacts } from '../abi/ts/Executor';
import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '@8xprotocol/base_contract';
import { TxData, classUtils } from '@8xprotocol/types';

import { Web3Utils } from '../utils/Web3Utils';

export class ExecutorContract extends BaseContract {
  public requirementsContract = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ExecutorContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.requirementsContract.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public stakeContract = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ExecutorContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.stakeContract.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public approvedRegistry = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ExecutorContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.approvedRegistry.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public transferProxy = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ExecutorContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.transferProxy.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public owner = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ExecutorContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.owner.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public lockUpPercentage = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as ExecutorContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.lockUpPercentage.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public paymentRegistry = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ExecutorContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.paymentRegistry.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public transferOwnership = {
    async sendTransactionAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.transferOwnership.estimateGasAsync.bind(
          self,
          _newOwner,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.transferOwnership, self.web3ContractInstance,
      )(
        _newOwner,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.transferOwnership.estimateGas, self.web3ContractInstance,
      )(
        _newOwner,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _newOwner: string,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferOwnership.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.transferOwnership.call,
        self.web3ContractInstance,
      )(
        _newOwner,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public maximumIntervalDivisor = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as ExecutorContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.maximumIntervalDivisor.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public setPercentageLockUp = {
    async sendTransactionAsync(
      _percentage: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setPercentageLockUp.estimateGasAsync.bind(
          self,
          _percentage,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setPercentageLockUp, self.web3ContractInstance,
      )(
        _percentage,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _percentage: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setPercentageLockUp.estimateGas, self.web3ContractInstance,
      )(
        _percentage,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _percentage: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setPercentageLockUp.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _percentage: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setPercentageLockUp.call,
        self.web3ContractInstance,
      )(
        _percentage,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setMaximumIntervalDivisor = {
    async sendTransactionAsync(
      _divisor: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setMaximumIntervalDivisor.estimateGasAsync.bind(
          self,
          _divisor,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setMaximumIntervalDivisor, self.web3ContractInstance,
      )(
        _divisor,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _divisor: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setMaximumIntervalDivisor.estimateGas, self.web3ContractInstance,
      )(
        _divisor,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _divisor: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setMaximumIntervalDivisor.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _divisor: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setMaximumIntervalDivisor.call,
        self.web3ContractInstance,
      )(
        _divisor,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public activateSubscription = {
    async sendTransactionAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.activateSubscription.estimateGasAsync.bind(
          self,
          _subscriptionContract,
          _subscriptionIdentifier,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.activateSubscription, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.activateSubscription.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.activateSubscription.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.activateSubscription.call,
        self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public processSubscription = {
    async sendTransactionAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.processSubscription.estimateGasAsync.bind(
          self,
          _subscriptionContract,
          _subscriptionIdentifier,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.processSubscription, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.processSubscription.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.processSubscription.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.processSubscription.call,
        self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public releaseSubscription = {
    async sendTransactionAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.releaseSubscription.estimateGasAsync.bind(
          self,
          _subscriptionContract,
          _subscriptionIdentifier,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.releaseSubscription, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.releaseSubscription.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.releaseSubscription.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.releaseSubscription.call,
        self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public catchLateSubscription = {
    async sendTransactionAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.catchLateSubscription.estimateGasAsync.bind(
          self,
          _subscriptionContract,
          _subscriptionIdentifier,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.catchLateSubscription, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.catchLateSubscription.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.catchLateSubscription.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.catchLateSubscription.call,
        self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public determineStake = {
    async sendTransactionAsync(
      _tokenAddress: string,
      _startDate: BigNumber,
      _interval: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.determineStake.estimateGasAsync.bind(
          self,
          _tokenAddress,
          _startDate,
          _interval,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.determineStake, self.web3ContractInstance,
      )(
        _tokenAddress,
        _startDate,
        _interval,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      _startDate: BigNumber,
      _interval: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.determineStake.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        _startDate,
        _interval,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      _startDate: BigNumber,
      _interval: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.determineStake.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      _startDate: BigNumber,
      _interval: BigNumber,
      txData: TxData = {},
    ): Promise<BigNumber
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.determineStake.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
        _startDate,
        _interval,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public attemptProcessing = {
    async sendTransactionAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _serviceNode: string,
      _newLastPaymentDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.attemptProcessing.estimateGasAsync.bind(
          self,
          _subscriptionContract,
          _subscriptionIdentifier,
          _tokenAddress,
          _serviceNode,
          _newLastPaymentDate,
          _amount,
          _fee,
          _staked,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.attemptProcessing, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        _tokenAddress,
        _serviceNode,
        _newLastPaymentDate,
        _amount,
        _fee,
        _staked,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _serviceNode: string,
      _newLastPaymentDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.attemptProcessing.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        _tokenAddress,
        _serviceNode,
        _newLastPaymentDate,
        _amount,
        _fee,
        _staked,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _serviceNode: string,
      _newLastPaymentDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as ExecutorContract;
      const abiEncodedTransactionData = self.web3ContractInstance.attemptProcessing.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionContract: string,
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _serviceNode: string,
      _newLastPaymentDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ExecutorContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.attemptProcessing.call,
        self.web3ContractInstance,
      )(
        _subscriptionContract,
        _subscriptionIdentifier,
        _tokenAddress,
        _serviceNode,
        _newLastPaymentDate,
        _amount,
        _fee,
        _staked,
        txDataWithDefaults,
      );
      return result;
    },
  };
  async deploy(...args: any[]): Promise<any> {
    const wrapper = this;

    return new Promise((resolve, reject) => {
      wrapper.web3ContractInstance.new(
        wrapper.defaults,
        (err: string, contract: Web3.ContractInstance) => {
          if (err) {
            reject(err);
          } else if (contract.address) {
            wrapper.web3ContractInstance = wrapper.web3ContractInstance.at(contract.address);
            wrapper.address = contract.address;
            resolve();
          }
        },
      );
    });
  }
  static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<ExecutorContract> {
    const currentNetwork = web3.version.network;
    const { abi, networks }: { abi: any; networks: any } = ContractArtifacts;
    const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

    return new ExecutorContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Partial<TxData>,
  ): Promise<ExecutorContract> {
    const { abi }: { abi: any } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = web3.eth.contract(abi).at(address);

      return new ExecutorContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('Executor', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
