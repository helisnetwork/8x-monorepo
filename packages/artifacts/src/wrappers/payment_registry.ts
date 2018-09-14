'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
import { promisify } from '@0xproject/utils';
import { BigNumber } from 'bignumber.js';

import * as Web3 from 'web3';

import { PaymentRegistry as ContractArtifacts } from '../abi/ts/PaymentRegistry';
import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '@8xprotocol/base_contract';
import { TxData, classUtils } from '@8xprotocol/types';

import { Web3Utils } from '../utils/Web3Utils';

export class PaymentRegistryContract extends BaseContract {
  public payments = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]
  > {
      const self = this as PaymentRegistryContract;
      const result = await promisify<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]
  >(
        self.web3ContractInstance.payments.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public addAuthorizedAddress = {
    async sendTransactionAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.addAuthorizedAddress.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
  public removeAuthorizedAddress = {
    async sendTransactionAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.removeAuthorizedAddress.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _target: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
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
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferOwnership.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as PaymentRegistryContract;
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
  public createNewPayment = {
    async sendTransactionAsync(
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _dueDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.createNewPayment.estimateGasAsync.bind(
          self,
          _subscriptionIdentifier,
          _tokenAddress,
          _dueDate,
          _amount,
          _fee,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.createNewPayment, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _tokenAddress,
        _dueDate,
        _amount,
        _fee,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _dueDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.createNewPayment.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _tokenAddress,
        _dueDate,
        _amount,
        _fee,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _dueDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.createNewPayment.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionIdentifier: string,
      _tokenAddress: string,
      _dueDate: BigNumber,
      _amount: BigNumber,
      _fee: BigNumber,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.createNewPayment.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _tokenAddress,
        _dueDate,
        _amount,
        _fee,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public claimPayment = {
    async sendTransactionAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.claimPayment.estimateGasAsync.bind(
          self,
          _subscriptionIdentifier,
          _claimant,
          _nextPayment,
          _staked,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.claimPayment, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        _nextPayment,
        _staked,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.claimPayment.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        _nextPayment,
        _staked,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.claimPayment.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      _staked: BigNumber,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.claimPayment.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        _nextPayment,
        _staked,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public removeClaimant = {
    async sendTransactionAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.removeClaimant.estimateGasAsync.bind(
          self,
          _subscriptionIdentifier,
          _claimant,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.removeClaimant, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.removeClaimant.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionIdentifier: string,
      _claimant: string,
      txData: TxData = {},
    ): string {
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.removeClaimant.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.removeClaimant.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public transferClaimant = {
    async sendTransactionAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.transferClaimant.estimateGasAsync.bind(
          self,
          _subscriptionIdentifier,
          _claimant,
          _nextPayment,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.transferClaimant, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        _nextPayment,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.transferClaimant.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        _nextPayment,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      txData: TxData = {},
    ): string {
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferClaimant.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionIdentifier: string,
      _claimant: string,
      _nextPayment: BigNumber,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.transferClaimant.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        _claimant,
        _nextPayment,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public cancelPayment = {
    async sendTransactionAsync(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.cancelPayment.estimateGasAsync.bind(
          self,
          _subscriptionIdentifier,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.cancelPayment, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.cancelPayment.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): string {
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.cancelPayment.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.cancelPayment.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public deletePayment = {
    async sendTransactionAsync(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.deletePayment.estimateGasAsync.bind(
          self,
          _subscriptionIdentifier,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.deletePayment, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.deletePayment.estimateGas, self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): string {
      const self = this as PaymentRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.deletePayment.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _subscriptionIdentifier: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as PaymentRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.deletePayment.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdentifier,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public getPaymentInformation = {
    async callAsync(
      _subscriptionIdenitifer: string,
      defaultBlock?: any,
    ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]
  > {
      const self = this as PaymentRegistryContract;
      const result = await promisify<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]
  >(
        self.web3ContractInstance.getPaymentInformation.call,
        self.web3ContractInstance,
      )(
        _subscriptionIdenitifer,
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
  static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<PaymentRegistryContract> {
    const currentNetwork = web3.version.network;
    const { abi, networks }: { abi: any; networks: any } = ContractArtifacts;
    const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

    return new PaymentRegistryContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Partial<TxData>,
  ): Promise<PaymentRegistryContract> {
    const { abi }: { abi: any } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = web3.eth.contract(abi).at(address);

      return new PaymentRegistryContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('PaymentRegistry', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
