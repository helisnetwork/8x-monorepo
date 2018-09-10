import {
  ExecutorContract,
  ExecutorJson,
  VolumeSubscriptionContract,
  VolumeSubscriptionJson,
  ActionProxyContract,
  ActionProxyJson,
  PaymentRegistryContract,
  PaymentRegistryJson
} from '@8xprotocol/artifacts';

import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { AddressBook } from '@8xprotocol/types';

import {
  EXECUTOR_CACHE_KEY,
  PAYMENT_REGISTRY_CACHE_KEY,
  VOLUME_SUBSCRIPTION_CACHE_KEY,
  ACTION_PROXY_CACHE_KEY
} from '../utils/constants';

export interface EightExContracts {
  executorContract: ExecutorContract;
  volumeVolumescription: VolumeSubscriptionContract;
  actionProxy: ActionProxyContract;
  paymentRegistry: PaymentRegistryContract;
}

export default class Contracts {

  private web3: Web3Wrapper;
  private addressBook: AddressBook;

  private cache: { [contractName: string]: (
      ExecutorContract | VolumeSubscriptionContract | ActionProxyContract | PaymentRegistryContract
    )
  };

  constructor(web3: Web3Wrapper, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;
    this.cache = {};
  }

  public async loadExecutor(): Promise<ExecutorContract> {
    if (this.cache[EXECUTOR_CACHE_KEY]) {
      return this.cache[EXECUTOR_CACHE_KEY] as ExecutorContract;
    }
    let a = this.web3.getProvider();
    a
    let executorContract = new ExecutorContract(ExecutorJson.abi, this.addressBook.executorAddress || '', this.web3.getProvider());
    this.cache[EXECUTOR_CACHE_KEY] = executorContract;

    return executorContract;
  }

  public async loadPaymentRegistry(): Promise<PaymentRegistryContract> {
    if (this.cache[PAYMENT_REGISTRY_CACHE_KEY]) {
      return this.cache[PAYMENT_REGISTRY_CACHE_KEY] as PaymentRegistryContract;
    }

    let paymentRegistry = new PaymentRegistryContract(PaymentRegistryJson.abi, this.addressBook.paymentRegistryAddress || '', this.web3.getProvider());
    this.cache[PAYMENT_REGISTRY_CACHE_KEY] = paymentRegistry;

    return paymentRegistry
  }

  public async loadVolumeSubscription(): Promise<VolumeSubscriptionContract> {
    if (this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY]) {
      return this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY] as VolumeSubscriptionContract;
    }

    let volumeSubscription = new VolumeSubscriptionContract(VolumeSubscriptionJson.abi, this.addressBook.volumeSubscriptionAddress || '', this.web3.getProvider());
    this.cache[VOLUME_SUBSCRIPTION_CACHE_KEY] = volumeSubscription;

    return volumeSubscription;
  }

  public async loadActionProxy(): Promise<ActionProxyContract> {
    if (this.cache[ACTION_PROXY_CACHE_KEY]) {
      return this.cache[ACTION_PROXY_CACHE_KEY] as ActionProxyContract;
    }

    let actionProxy = new ActionProxyContract(ActionProxyJson.abi, this.addressBook.actionProxyAddress || '', this.web3.getProvider());
    this.cache[ACTION_PROXY_CACHE_KEY] = actionProxy;

    return actionProxy;
  }

}