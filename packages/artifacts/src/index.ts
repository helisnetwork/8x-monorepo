import { AddressBook } from '../types/address_book';
import fs from 'fs-extra';

export function getAddressBook(network: string): AddressBook {

  let data = fs.readJsonSync(__dirname + '/../deployed/config.json');

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