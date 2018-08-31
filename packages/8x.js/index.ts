import { Executor, VolumeSubscription, ActionProxy } from 'artifacts';
import { AddressBook } from './types/address_book';

export default class EightExJS {

  public executor: Executor;
  public volumeSubscription: VolumeSubscription;
  public actionProxy: ActionProxy;

  constructor(web3: any, addressBook: AddressBook) {
    this.instantiateServices(web3, addressBook);
  }

  public async instantiateServices(web3: any, addressBook: AddressBook) {
    this.executor = await Executor.createAndValidate(web3, addressBook.executorAddress);
    this.volumeSubscription = await VolumeSubscription.createAndValidate(web3, addressBook.volumeSubscriptionAddress);
    this.actionProxy = await ActionProxy.createAndValidate(web3, addressBook.actionProxyAddress);
  }

}