import { Executor, VolumeSubscription, ActionProxy, PaymentRegistry } from 'artifacts';
import { AddressBook } from '../types/address_book';

import {
  EXECUTOR_CACHE_KEY,
  PAYMENT_REGISTRY_CACHE_KEY,
  VOLUME_SUBSCRIPTION_CACHE_KEY,
  ACTION_PROXY_CACHE_KEY
} from '../utils/constants';

export interface EightExContracts {
  executorContract: Executor;
  volumeVolumescription: VolumeSubscription;
  actionProxy: ActionProxy;
  paymentRegistry: PaymentRegistry;
}

export default class Contracts {

  private web3: any;
  private addressBook: AddressBook;

  private cache: { [contractName: string]: (
      Executor | VolumeSubscription | ActionProxy | PaymentRegistry
    )
  };

  constructor(web3: any, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.cache = {};
  }

  public async loadExecutor(): Promise<Executor> {
    if (this.cache[EXECUTOR_CACHE_KEY]) {
      return this.cache[EXECUTOR_CACHE_KEY] as Executor;
    }

    let executorContract = await Executor.createAndValidate(this.web3, this.addressBook.executorAddress || '');
    this.cache[EXECUTOR_CACHE_KEY] = executorContract;

    return executorContract;
  }

  public async loadPaymentRegistry(): Promise<PaymentRegistry> {
    if (this.cache[PAYMENT_REGISTRY_CACHE_KEY]) {
      return this.cache[PAYMENT_REGISTRY_CACHE_KEY] as PaymentRegistry;
    }

    let paymentRegistry = await PaymentRegistry.createAndValidate(this.web3, this.addressBook.paymentRegistryAddress || '');
    this.cache[PAYMENT_REGISTRY_CACHE_KEY] = paymentRegistry;

    return paymentRegistry
  }

  public async loadVolumeSubscription(): Promise<VolumeSubscription> {
    if (this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY]) {
      return this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY] as VolumeSubscription;
    }

    let volumeSubscription = await VolumeSubscription.createAndValidate(this.web3, this.addressBook.volumeSubscriptionAddress || '');
    this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY] = volumeSubscription;

    return volumeSubscription;
  }

  public async loadActionProxy(): Promise<ActionProxy> {
    if (this.cache[ACTION_PROXY_CACHE_KEY]) {
      return this.cache[ACTION_PROXY_CACHE_KEY] as ActionProxy;
    }

    let actionProxy = await ActionProxy.createAndValidate(this.web3, this.addressBook.actionProxyAddress || '');
    this.cache[ACTION_PROXY_CACHE_KEY] = actionProxy;

    return actionProxy;
  }

}