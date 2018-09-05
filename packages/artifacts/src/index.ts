import { AddressBook } from '../types/address_book';
import * as data from '../deployed/config.json';
import { VolumeSubscription } from '../ts/VolumeSubscription';

export function getAddressBook(network: string): AddressBook {

  let a: string = 'development';

  let addresses = (<any>data)[network]["addresses"];

  return {
    executorAddress: addresses.Executor,
    volumeSubscriptionAddress: addresses.VolumeSubscription,
    approvedRegistryAddress: addresses.ApprovedRegistry,
    transferProxyAddress: addresses.TransferProxy,
    paymentRegistryAddress: addresses.PaymentRegistry,
    requirementsAddress: addresses.Requirements,
    stakeContractAddress: addresses.StakeContract,
    actionProxyAddress: addresses.ActionProxy,
    daiAddress: addresses.DAI
  }

};