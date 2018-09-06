/************************************
 *       8x Protocol Contracts      *
 ************************************/

// A contract for making it easy to subscribe in a single transaction.
export { ActionProxyContract } from './ts/action_proxy';

// Core contract that contains payment logic.
export { ExecutorContract } from './ts/executor';

// Stores state about each smart contract.
export { PaymentRegistryContract } from './ts/payment_registry';

// Calculate how many tokens are required based on parameters.
export { RequirementsContract } from './ts/requirements';

// Contract to stake 8x tokens for service nodes.
export { StakeContractContract } from './ts/stake_contract';

// Subscription contract containing plans and subscriber details.
export { VolumeSubscriptionContract } from './ts/volume_subscription';

// Export the Address Book type
export { AddressBook } from './types/address_book';

// Export the function to retrieve the AddressBook for the network you want
export { getAddressBook } from './src/index';