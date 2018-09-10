/************************************
 *       8x Protocol Contracts      *
 ************************************/

import fs from 'fs-extra';

// A contract for making it easy to subscribe in a single transaction.
let ActionProxyJson = fs.readJsonSync(__dirname + '/json/ActionProxy.json');

export { ActionProxyJson };
export { ActionProxyContract } from './ts/action_proxy';

// Core contract that contains payment logic.
let ExecutorJson = fs.readJsonSync(__dirname + '/json/Executor.json');

export { ExecutorJson };
export { ExecutorContract } from './ts/executor';

// Stores state about each smart contract.
let PaymentRegistryJson = fs.readJSONSync(__dirname + '/json/PaymentRegistry.json');

export { PaymentRegistryJson };
export { PaymentRegistryContract } from './ts/payment_registry';

// Calculate how many tokens are required based on parameters.
let RequirementsJson = fs.readJsonSync(__dirname + '/json/StakeContract.json');

export { RequirementsJson };
export { RequirementsContract } from './ts/requirements';

// Contract to stake 8x tokens for service nodes.
let StakeContractJson = fs.readJsonSync(__dirname + '/json/StakeContract.json');

export { StakeContractJson };
export { StakeContractContract } from './ts/stake_contract';

// Subscription contract containing plans and subscriber details.
let VolumeSubscriptionJson = fs.readJsonSync(__dirname + '/json/VolumeSubscription.json');

export { VolumeSubscriptionJson }
export { VolumeSubscriptionContract } from './ts/volume_subscription';

// Export the Address Book type
export { AddressBook } from './types/address_book';

// Export the function to retrieve the AddressBook for the network you want
export { getAddressBook } from './src/index';
