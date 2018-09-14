'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
import { promisify } from '@0xproject/utils';
import { BigNumber } from 'bignumber.js';

import * as Web3 from 'web3';

import { StakeContract as ContractArtifacts } from '../abi/ts/StakeContract';
import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '@8xprotocol/base_contract';
import { TxData, classUtils } from '@8xprotocol/types';

import { Web3Utils } from '../utils/Web3Utils';

export class StakeContractContract extends BaseContract {
  public addAuthorizedAddress = {
    async sendTransactionAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.addAuthorizedAddress.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
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
  public tokenContract = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as StakeContractContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.tokenContract.call,
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.removeAuthorizedAddress.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
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
  public userStakes = {
    async callAsync(
      index_0: string,
      index_1: string,
      defaultBlock?: any,
    ): Promise<[BigNumber, BigNumber]
  > {
      const self = this as StakeContractContract;
      const result = await promisify<[BigNumber, BigNumber]
  >(
        self.web3ContractInstance.userStakes.call,
        self.web3ContractInstance,
      )(
        index_0,
        index_1,
      );
      return result;
    },
  };
  public owner = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as StakeContractContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.owner.call,
        self.web3ContractInstance,
      )(
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
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
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferOwnership.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
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
  public setGiniCoefficient = {
    async sendTransactionAsync(
      _tokenAddress: string,
      _gini: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setGiniCoefficient.estimateGasAsync.bind(
          self,
          _tokenAddress,
          _gini,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setGiniCoefficient, self.web3ContractInstance,
      )(
        _tokenAddress,
        _gini,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      _gini: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setGiniCoefficient.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        _gini,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      _gini: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setGiniCoefficient.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      _gini: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setGiniCoefficient.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
        _gini,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setDivideTotalBy = {
    async sendTransactionAsync(
      _tokenAddress: string,
      _divideBy: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setDivideTotalBy.estimateGasAsync.bind(
          self,
          _tokenAddress,
          _divideBy,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.setDivideTotalBy, self.web3ContractInstance,
      )(
        _tokenAddress,
        _divideBy,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      _divideBy: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.setDivideTotalBy.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        _divideBy,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      _divideBy: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.setDivideTotalBy.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      _divideBy: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.setDivideTotalBy.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
        _divideBy,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public lockTokens = {
    async sendTransactionAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.lockTokens.estimateGasAsync.bind(
          self,
          _staker,
          _tokenAddress,
          _amount,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.lockTokens, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.lockTokens.estimateGas, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.lockTokens.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.lockTokens.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public unlockTokens = {
    async sendTransactionAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.unlockTokens.estimateGasAsync.bind(
          self,
          _staker,
          _tokenAddress,
          _amount,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.unlockTokens, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.unlockTokens.estimateGas, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.unlockTokens.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.unlockTokens.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public slashTokens = {
    async sendTransactionAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.slashTokens.estimateGasAsync.bind(
          self,
          _staker,
          _tokenAddress,
          _amount,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.slashTokens, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.slashTokens.estimateGas, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.slashTokens.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.slashTokens.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public transferStake = {
    async sendTransactionAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      _destination: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.transferStake.estimateGasAsync.bind(
          self,
          _staker,
          _tokenAddress,
          _amount,
          _destination,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.transferStake, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        _destination,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      _destination: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.transferStake.estimateGas, self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        _destination,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      _destination: string,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferStake.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      _amount: BigNumber,
      _destination: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.transferStake.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
        _amount,
        _destination,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public getTotalStake = {
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as StakeContractContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getTotalStake.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
      );
      return result;
    },
  };
  public getAvailableStake = {
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as StakeContractContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getAvailableStake.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
      );
      return result;
    },
  };
  public getLockedStake = {
    async callAsync(
      _staker: string,
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as StakeContractContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getLockedStake.call,
        self.web3ContractInstance,
      )(
        _staker,
        _tokenAddress,
      );
      return result;
    },
  };
  public getTotalTokenStake = {
    async callAsync(
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as StakeContractContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getTotalTokenStake.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
      );
      return result;
    },
  };
  public getAvailableTokenStake = {
    async callAsync(
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as StakeContractContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getAvailableTokenStake.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
      );
      return result;
    },
  };
  public getLockedTokenStake = {
    async callAsync(
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as StakeContractContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getLockedTokenStake.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
      );
      return result;
    },
  };
  public getTokenStakeDetails = {
    async callAsync(
      _tokenAddress: string,
      defaultBlock?: any,
    ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]
  > {
      const self = this as StakeContractContract;
      const result = await promisify<[BigNumber, BigNumber, BigNumber, BigNumber]
  >(
        self.web3ContractInstance.getTokenStakeDetails.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
      );
      return result;
    },
  };
  public topUpStake = {
    async sendTransactionAsync(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.topUpStake.estimateGasAsync.bind(
          self,
          _amount,
          _tokenAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.topUpStake, self.web3ContractInstance,
      )(
        _amount,
        _tokenAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.topUpStake.estimateGas, self.web3ContractInstance,
      )(
        _amount,
        _tokenAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.topUpStake.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.topUpStake.call,
        self.web3ContractInstance,
      )(
        _amount,
        _tokenAddress,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public withdrawStake = {
    async sendTransactionAsync(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.withdrawStake.estimateGasAsync.bind(
          self,
          _amount,
          _tokenAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.withdrawStake, self.web3ContractInstance,
      )(
        _amount,
        _tokenAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.withdrawStake.estimateGas, self.web3ContractInstance,
      )(
        _amount,
        _tokenAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as StakeContractContract;
      const abiEncodedTransactionData = self.web3ContractInstance.withdrawStake.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _amount: BigNumber,
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as StakeContractContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.withdrawStake.call,
        self.web3ContractInstance,
      )(
        _amount,
        _tokenAddress,
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
  static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<StakeContractContract> {
    const currentNetwork = web3.version.network;
    const { abi, networks }: { abi: any; networks: any } = ContractArtifacts;
    const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

    return new StakeContractContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Partial<TxData>,
  ): Promise<StakeContractContract> {
    const { abi }: { abi: any } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = web3.eth.contract(abi).at(address);

      return new StakeContractContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('StakeContract', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
