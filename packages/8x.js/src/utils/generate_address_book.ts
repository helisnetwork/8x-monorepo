import { ConfigAddresses } from '@8xprotocol/artifacts';
import { AddressBook } from '@8xprotocol/types';

export default function generateAddressBook(network: string): AddressBook {
  let addresses;

  switch (network) {
    case "develop":
      return {
        approvedRegistryAddress: ConfigAddresses.develop.addresses.ApprovedRegistry,
        executorAddress: ConfigAddresses.develop.addresses.Executor,
        paymentRegistryAddress: ConfigAddresses.develop.addresses.PaymentRegistry,
        requirementsAddress: ConfigAddresses.develop.addresses.Requirements,
        stakeContractAddress: ConfigAddresses.develop.addresses.StakeContract,
        transferProxyAddress: ConfigAddresses.develop.addresses.TransferProxy,
        volumeSubscriptionAddress: ConfigAddresses.develop.addresses.VolumeSubscription
      } as AddressBook;
      break;
    case "kovan":
      return {
        approvedRegistryAddress: ConfigAddresses.kovan.addresses.ApprovedRegistry,
        executorAddress: ConfigAddresses.kovan.addresses.Executor,
        paymentRegistryAddress: ConfigAddresses.kovan.addresses.PaymentRegistry,
        requirementsAddress: ConfigAddresses.kovan.addresses.Requirements,
        stakeContractAddress: ConfigAddresses.kovan.addresses.StakeContract,
        transferProxyAddress: ConfigAddresses.kovan.addresses.TransferProxy,
        volumeSubscriptionAddress: ConfigAddresses.kovan.addresses.VolumeSubscription
      } as AddressBook;
    default:
      break;
  }

}