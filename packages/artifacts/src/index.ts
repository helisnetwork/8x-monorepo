// Export TypeScript ABIs

import { ApprovedRegistry } from './abi/ts/ApprovedRegistry';
import { Executor } from './abi/ts/Executor';
import { PaymentRegistry } from './abi/ts/PaymentRegistry';
import { Requirements } from './abi/ts/Requirements';
import { StakeContract } from './abi/ts/StakeContract';
import { VolumeSubscription } from './abi/ts/VolumeSubscription';

export {
  ApprovedRegistry as ApprovedRegistryAbi,
  Executor as ExecutorAbi,
  PaymentRegistry as PaymentRegistryAbi,
  Requirements as RequirementsAbi,
  StakeContract as StakeContractAbi,
  VolumeSubscription as VolumeSubscriptionAbi
};

// Export contract wrappers

import { ApprovedRegistryContract } from './wrappers/approved_registry';
import { ExecutorContract } from './wrappers/executor';
import { PaymentRegistryContract } from './wrappers/payment_registry';
import { RequirementsContract } from './wrappers/requirements';
import { StakeContractContract } from './wrappers/stake_contract';

export {
  ApprovedRegistryContract,
  ExecutorContract,
  PaymentRegistryContract,
  RequirementsContract,
  StakeContractContract as StakeContract
}

// Export all the addresses

import config from './addresses/config.json';
import dependencies from './addresses/dependencies.json';
import tokens from './addresses/tokens.json';

export {
  config as ConfigAddresses,
  dependencies as DependencyAddresses,
  tokens as TokenAddresses
}