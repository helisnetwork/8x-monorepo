import {
  ExecutorContract,
  ExecutorAbi,
  VolumeSubscriptionContract,
  VolumeSubscriptionAbi,
  PaymentRegistryContract,
  PaymentRegistryAbi,
  ConfigAddresses,
  TokenAddresses,
  MockTokenContract
} from '@8xprotocol/artifacts';

import { AddressBook, Address } from '@8xprotocol/types';

import * as Web3 from 'web3';

import {
  EXECUTOR_CACHE_KEY,
  PAYMENT_REGISTRY_CACHE_KEY,
  VOLUME_SUBSCRIPTION_CACHE_KEY,
  KYBER_CACHE_KEY
} from '../constants';

export interface EightExContracts {
  executorContract: ExecutorContract;
  volumeVolumescription: VolumeSubscriptionContract;
  paymentRegistry: PaymentRegistryContract;
}

export default class Contracts {

  private web3: Web3;
  private addressBook: AddressBook;

  private cache: { [contractName: string]: (
      ExecutorContract | VolumeSubscriptionContract | PaymentRegistryContract | MockTokenContract
    )
  };

  constructor(web3: Web3, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.cache = {};
  }

  public async loadExecutor(): Promise<ExecutorContract> {
    if (this.cache[EXECUTOR_CACHE_KEY]) {
      return this.cache[EXECUTOR_CACHE_KEY] as ExecutorContract;
    }

    let executorContract = await ExecutorContract.at(this.addressBook.executorAddress || '', this.web3, {});
    this.cache[EXECUTOR_CACHE_KEY] = executorContract;

    return executorContract;
  }

  public async loadPaymentRegistry(): Promise<PaymentRegistryContract> {
    if (this.cache[PAYMENT_REGISTRY_CACHE_KEY]) {
      return this.cache[PAYMENT_REGISTRY_CACHE_KEY] as PaymentRegistryContract;
    }

    let paymentRegistry = await PaymentRegistryContract.at(this.addressBook.paymentRegistryAddress || '', this.web3, {});
    this.cache[PAYMENT_REGISTRY_CACHE_KEY] = paymentRegistry;

    return paymentRegistry
  }

  public async loadVolumeSubscription(): Promise<VolumeSubscriptionContract> {
    if (this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY]) {
      return this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY] as VolumeSubscriptionContract;
    }

    let volumeSubscription = await VolumeSubscriptionContract.at(this.addressBook.volumeSubscriptionAddress || '', this.web3, {});
    this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY] = volumeSubscription;

    return volumeSubscription;
  }

  public async loadERC20Token(address: Address): Promise<MockTokenContract> {
    let cacheKey = this.getERC20TokenCacheKey(address);
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey] as MockTokenContract;
    }

    let tokenContract = await MockTokenContract.at(address, this.web3, {});
    this.cache[cacheKey] = tokenContract;

    return tokenContract;

  }

  private getERC20TokenCacheKey(tokenAddress: Address): string {
    return `ERC20Token_${tokenAddress}`;
  }

}