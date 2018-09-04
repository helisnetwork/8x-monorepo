import { AddressBook } from '../types/address_book';

export default function exportConfigToJSON(config) {
  var addressBook: AddressBook;
  addressBook.executorAddress = config.addresses.Executor;
  addressBook.volumeSubscriptionAddress = config.addresses.VolumeSubscription;
  addressBook.approvedRegistryAddress = config.addresses.ApprovedRegistry;
  addressBook.transferProxyAddress = config.addresses.TransferProxy;
  addressBook.paymentRegistryAddress = config.addresses.PaymentRegistry;
  addressBook.requirementsAddress = config.addresses.Requirements;
  addressBook.stakeContractAddress = config.addresses.StakeContract;
  addressBook.actionProxyAddress = config.addresses.ActionProxy;
  return addressBook;
};