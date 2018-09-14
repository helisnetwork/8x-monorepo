'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
import { promisify } from '@0xproject/utils';
import { BigNumber } from 'bignumber.js';

import * as Web3 from 'web3';

import { ApprovedRegistry as ContractArtifacts } from '../abi/ts/ApprovedRegistry';
import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '@8xprotocol/base_contract';
import { TxData, classUtils } from '@8xprotocol/types';

import { Web3Utils } from '../utils/Web3Utils';

export class ApprovedRegistryContract extends BaseContract {
  public wrappedEther = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.wrappedEther.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public approvedContractArray = {
    async callAsync(
      index_0: BigNumber,
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.approvedContractArray.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public approvedContractMapping = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.approvedContractMapping.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public approvedTokenArray = {
    async callAsync(
      index_0: BigNumber,
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.approvedTokenArray.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public owner = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.owner.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public approvedTokenMapping = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.approvedTokenMapping.call,
        self.web3ContractInstance,
      )(
        index_0,
      );
      return result;
    },
  };
  public kyberProxy = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.kyberProxy.call,
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
      const self = this as ApprovedRegistryContract;
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
      const self = this as ApprovedRegistryContract;
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
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.transferOwnership.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _newOwner: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ApprovedRegistryContract;
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
  public getRateFor = {
    async sendTransactionAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.getRateFor.estimateGasAsync.bind(
          self,
          _tokenAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.getRateFor, self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.getRateFor.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.getRateFor.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<BigNumber
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.getRateFor.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public addApprovedContract = {
    async sendTransactionAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.addApprovedContract.estimateGasAsync.bind(
          self,
          _contractAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.addApprovedContract, self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.addApprovedContract.estimateGas, self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _contractAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.addApprovedContract.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.addApprovedContract.call,
        self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public addApprovedToken = {
    async sendTransactionAsync(
      _tokenAddress: string,
      _isWETH: boolean,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.addApprovedToken.estimateGasAsync.bind(
          self,
          _tokenAddress,
          _isWETH,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.addApprovedToken, self.web3ContractInstance,
      )(
        _tokenAddress,
        _isWETH,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      _isWETH: boolean,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.addApprovedToken.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        _isWETH,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      _isWETH: boolean,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.addApprovedToken.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      _isWETH: boolean,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.addApprovedToken.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
        _isWETH,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public removeApprovedContract = {
    async sendTransactionAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.removeApprovedContract.estimateGasAsync.bind(
          self,
          _contractAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.removeApprovedContract, self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.removeApprovedContract.estimateGas, self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _contractAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.removeApprovedContract.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.removeApprovedContract.call,
        self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public removeApprovedToken = {
    async sendTransactionAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.removeApprovedToken.estimateGasAsync.bind(
          self,
          _tokenAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.removeApprovedToken, self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.removeApprovedToken.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.removeApprovedToken.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<void
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.removeApprovedToken.call,
        self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public getApprovedContracts = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string[]
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string[]
  >(
        self.web3ContractInstance.getApprovedContracts.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public getApprovedTokens = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string[]
  > {
      const self = this as ApprovedRegistryContract;
      const result = await promisify<string[]
  >(
        self.web3ContractInstance.getApprovedTokens.call,
        self.web3ContractInstance,
      )(
      );
      return result;
    },
  };
  public isContractAuthorised = {
    async sendTransactionAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.isContractAuthorised.estimateGasAsync.bind(
          self,
          _contractAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.isContractAuthorised, self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.isContractAuthorised.estimateGas, self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _contractAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.isContractAuthorised.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _contractAddress: string,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.isContractAuthorised.call,
        self.web3ContractInstance,
      )(
        _contractAddress,
        txDataWithDefaults,
      );
      return result;
    },
  };
  public isTokenAuthorised = {
    async sendTransactionAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<string> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.isTokenAuthorised.estimateGasAsync.bind(
          self,
          _tokenAddress,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.isTokenAuthorised, self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<number> {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.isTokenAuthorised.estimateGas, self.web3ContractInstance,
      )(
        _tokenAddress,
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _tokenAddress: string,
      txData: TxData = {},
    ): string {
      const self = this as ApprovedRegistryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.isTokenAuthorised.getData();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _tokenAddress: string,
      txData: TxData = {},
    ): Promise<boolean
  > {
      const self = this as ApprovedRegistryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.isTokenAuthorised.call,
        self.web3ContractInstance,
      )(
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
  static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<ApprovedRegistryContract> {
    const currentNetwork = web3.version.network;
    const { abi, networks }: { abi: any; networks: any } = ContractArtifacts;
    const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

    return new ApprovedRegistryContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Partial<TxData>,
  ): Promise<ApprovedRegistryContract> {
    const { abi }: { abi: any } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = web3.eth.contract(abi).at(address);

      return new ApprovedRegistryContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('ApprovedRegistry', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
