'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
import { promisify } from '@0xproject/utils';
import { BigNumber } from 'bignumber.js';

import * as Web3 from 'web3';

import { VolumeSubscription as ContractArtifacts } from '../abi/ts/VolumeSubscription';
import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '@8xprotocol/base_contract';
import { TxData, classUtils } from '@8xprotocol/types';

import { Web3Utils } from '../utils/Web3Utils';

export class VolumeSubscriptionContract extends BaseContract {
  public gasCost = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.gasCost.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public addAuthorizedAddress = {
    async sendTransactionAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.addAuthorizedAddress.estimateGasAsync.bind(
          self,
          _target,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.addAuthorizedAddress, self.web3ContractInstance,
      )(
        _target,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.addAuthorizedAddress.estimateGas, self.web3ContractInstance,
      )(
        _target,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _target: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.addAuthorizedAddress.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.addAuthorizedAddress.call,
        self.web3ContractInstance,
      )(
        _target,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public authorities = {
    async callAsync(
      index_0: BigNumber,
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.authorities.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public approvedRegistry = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.approvedRegistry.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public removeAuthorizedAddress = {
    async sendTransactionAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.removeAuthorizedAddress.estimateGasAsync.bind(
          self,
          _target,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.removeAuthorizedAddress, self.web3ContractInstance,
      )(
        _target,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.removeAuthorizedAddress.estimateGas, self.web3ContractInstance,
      )(
        _target,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _target: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.removeAuthorizedAddress.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.removeAuthorizedAddress.call,
        self.web3ContractInstance,
      )(
        _target,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public owner = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.owner.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public subscriptions = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<[string, string, string, BigNumber, BigNumber, string]
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<[string, string, string, BigNumber, BigNumber, string]
  >(
        self.web3ContractInstance.subscriptions.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public plans = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<[string, string, string, BigNumber, BigNumber, BigNumber, string, BigNumber]
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<[string, string, string, BigNumber, BigNumber, BigNumber, string, BigNumber]
  >(
        self.web3ContractInstance.plans.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public authorized = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.authorized.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public getAuthorizedAddresses = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string[]
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<string[]
  >(
        self.web3ContractInstance.getAuthorizedAddresses.call,
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
      const self = this as VolumeSubscriptionContract;
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
      const self = this as VolumeSubscriptionContract;
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
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferOwnership.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
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
  public gasPrice = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.gasPrice.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public terminatePlan = {
    async sendTransactionAsync(
      _plan: string,
      _terminationDate: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.terminatePlan.estimateGasAsync.bind(
          self,
          _plan,
          _terminationDate,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.terminatePlan, self.web3ContractInstance,
      )(
        _plan,
        _terminationDate,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _plan: string,
      _terminationDate: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.terminatePlan.estimateGas, self.web3ContractInstance,
      )(
        _plan,
        _terminationDate,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _plan: string,
      _terminationDate: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.terminatePlan.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _plan: string,
      _terminationDate: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.terminatePlan.call,
        self.web3ContractInstance,
      )(
        _plan,
        _terminationDate,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public isValidSubscription = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.isValidSubscription.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getSubscriptionTokenAddress = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.getSubscriptionTokenAddress.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getSubscriptionFromToAddresses = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<[string, string]
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<[string, string]
  >(
        self.web3ContractInstance.getSubscriptionFromToAddresses.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getSubscriptionInterval = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getSubscriptionInterval.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getAmountDueFromSubscription = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getAmountDueFromSubscription.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getSubscriptionFee = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getSubscriptionFee.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getLastSubscriptionPaymentDate = {
    async callAsync(
      _subscription: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getLastSubscriptionPaymentDate.call,
        self.web3ContractInstance,
      )(
        _subscription,
      );
      return result;
    },
  };
  public getGasForExecution = {
    async callAsync(
      _subscription: string,
      _type: BigNumber,
      defaultBlock?: any,
    ): Promise<[BigNumber, BigNumber]
  > {
      const self = this as VolumeSubscriptionContract;
      const result = await promisify<[BigNumber, BigNumber]
  >(
        self.web3ContractInstance.getGasForExecution.call,
        self.web3ContractInstance,
      )(
        _subscription,
        _type,
      );
      return result;
    },
  };
  public setLastPaymentDate = {
    async sendTransactionAsync(
      _date: BigNumber,
      _subscription: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setLastPaymentDate.estimateGasAsync.bind(
          self,
          _date,
          _subscription,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setLastPaymentDate, self.web3ContractInstance,
      )(
        _date,
        _subscription,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _date: BigNumber,
      _subscription: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setLastPaymentDate.estimateGas, self.web3ContractInstance,
      )(
        _date,
        _subscription,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _date: BigNumber,
      _subscription: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setLastPaymentDate.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _date: BigNumber,
      _subscription: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setLastPaymentDate.call,
        self.web3ContractInstance,
      )(
        _date,
        _subscription,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public cancelSubscription = {
    async sendTransactionAsync(
      _subscription: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.cancelSubscription.estimateGasAsync.bind(
          self,
          _subscription,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.cancelSubscription, self.web3ContractInstance,
      )(
        _subscription,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscription: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.cancelSubscription.estimateGas, self.web3ContractInstance,
      )(
        _subscription,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscription: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.cancelSubscription.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscription: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.cancelSubscription.call,
        self.web3ContractInstance,
      )(
        _subscription,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setGasPrice = {
    async sendTransactionAsync(
      _gasPrice: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setGasPrice.estimateGasAsync.bind(
          self,
          _gasPrice,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setGasPrice, self.web3ContractInstance,
      )(
        _gasPrice,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _gasPrice: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setGasPrice.estimateGas, self.web3ContractInstance,
      )(
        _gasPrice,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _gasPrice: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setGasPrice.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _gasPrice: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setGasPrice.call,
        self.web3ContractInstance,
      )(
        _gasPrice,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setGasCost = {
    async sendTransactionAsync(
      _gasCost: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setGasCost.estimateGasAsync.bind(
          self,
          _gasCost,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setGasCost, self.web3ContractInstance,
      )(
        _gasCost,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _gasCost: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setGasCost.estimateGas, self.web3ContractInstance,
      )(
        _gasCost,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _gasCost: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setGasCost.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _gasCost: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setGasCost.call,
        self.web3ContractInstance,
      )(
        _gasCost,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public createPlan = {
    async sendTransactionAsync(
      _owner: string,
      _tokenAddress: string,
      _identifier: string,
      _interval: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _data: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.createPlan.estimateGasAsync.bind(
          self,
          _owner,
          _tokenAddress,
          _identifier,
          _interval,
          _amount,
          _fee,
          _data,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.createPlan, self.web3ContractInstance,
      )(
        _owner,
        _tokenAddress,
        _identifier,
        _interval,
        _amount,
        _fee,
        _data,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _owner: string,
      _tokenAddress: string,
      _identifier: string,
      _interval: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _data: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.createPlan.estimateGas, self.web3ContractInstance,
      )(
        _owner,
        _tokenAddress,
        _identifier,
        _interval,
        _amount,
        _fee,
        _data,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _owner: string,
      _tokenAddress: string,
      _identifier: string,
      _interval: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _data: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.createPlan.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _owner: string,
      _tokenAddress: string,
      _identifier: string,
      _interval: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      _data: string,
      txData: TxData = {},
    ): Promise<string
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<string
  >(
        self.web3ContractInstance.createPlan.call,
        self.web3ContractInstance,
      )(
        _owner,
        _tokenAddress,
        _identifier,
        _interval,
        _amount,
        _fee,
        _data,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public createSubscription = {
    async sendTransactionAsync(
      _planHash: string,
      _data: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.createSubscription.estimateGasAsync.bind(
          self,
          _planHash,
          _data,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.createSubscription, self.web3ContractInstance,
      )(
        _planHash,
        _data,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _planHash: string,
      _data: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.createSubscription.estimateGas, self.web3ContractInstance,
      )(
        _planHash,
        _data,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _planHash: string,
      _data: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.createSubscription.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _planHash: string,
      _data: string,
      txData: TxData = {},
    ): Promise<string
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<string
  >(
        self.web3ContractInstance.createSubscription.call,
        self.web3ContractInstance,
      )(
        _planHash,
        _data,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setPlanOwner = {
    async sendTransactionAsync(
      _plan: string,
      _owner: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setPlanOwner.estimateGasAsync.bind(
          self,
          _plan,
          _owner,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setPlanOwner, self.web3ContractInstance,
      )(
        _plan,
        _owner,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _plan: string,
      _owner: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setPlanOwner.estimateGas, self.web3ContractInstance,
      )(
        _plan,
        _owner,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _plan: string,
      _owner: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setPlanOwner.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _plan: string,
      _owner: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setPlanOwner.call,
        self.web3ContractInstance,
      )(
        _plan,
        _owner,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setPlanData = {
    async sendTransactionAsync(
      _plan: string,
      _data: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setPlanData.estimateGasAsync.bind(
          self,
          _plan,
          _data,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setPlanData, self.web3ContractInstance,
      )(
        _plan,
        _data,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _plan: string,
      _data: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setPlanData.estimateGas, self.web3ContractInstance,
      )(
        _plan,
        _data,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _plan: string,
      _data: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setPlanData.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _plan: string,
      _data: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setPlanData.call,
        self.web3ContractInstance,
      )(
        _plan,
        _data,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setSubscriptionData = {
    async sendTransactionAsync(
      _subscription: string,
      _data: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setSubscriptionData.estimateGasAsync.bind(
          self,
          _subscription,
          _data,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setSubscriptionData, self.web3ContractInstance,
      )(
        _subscription,
        _data,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscription: string,
      _data: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setSubscriptionData.estimateGas, self.web3ContractInstance,
      )(
        _subscription,
        _data,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscription: string,
      _data: string,
      txData: TxData = {},
    ): string {
      const self = this as VolumeSubscriptionContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setSubscriptionData.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscription: string,
      _data: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as VolumeSubscriptionContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setSubscriptionData.call,
        self.web3ContractInstance,
      )(
        _subscription,
        _data,
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
  static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<VolumeSubscriptionContract> {
    const currentNetwork = web3.version.network;
    const { abi, networks }: { abi: any; networks: any } = ContractArtifacts;
    const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

    return new VolumeSubscriptionContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Partial<TxData>,
  ): Promise<VolumeSubscriptionContract> {
    const { abi }: { abi: any } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = web3.eth.contract(abi).at(address);

      return new VolumeSubscriptionContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('VolumeSubscription', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
