// Export TypeScript ABIs

import { ApprovedRegistry } from './build/abi/ts/ApprovedRegistry';
import { Executor } from './build/abi/ts/Executor';
import { PaymentRegistry } from './build/abi/ts/PaymentRegistry';
import { Requirements } from './build/abi/ts/Requirements';
import { StakeContract } from './build/abi/ts/StakeContract';
import { VolumeSubscription } from './build/abi/ts/VolumeSubscription';

import { MockToken } from './build/abi/ts/MockToken';
import { MockVolumeSubscription } from './build/abi/ts/MockVolumeSubscription';
import { MockKyberNetwork } from './build/abi/ts/MockKyberNetwork';

export {
  ApprovedRegistry as ApprovedRegistryAbi,
  Executor as ExecutorAbi,
  PaymentRegistry as PaymentRegistryAbi,
  Requirements as RequirementsAbi,
  StakeContract as StakeContractAbi,
  VolumeSubscription as VolumeSubscriptionAbi,
  MockKyberNetwork as MockKyberNetworkAbi,
  MockToken as MockTokenAbi,
  MockVolumeSubscription as MockVolumeSubscriptionAbi
};

// Export contract wrappers

import { ApprovedRegistryContract } from './build/wrappers/approved_registry';
import { ExecutorContract } from './build/wrappers/executor';
import { PaymentRegistryContract } from './build/wrappers/payment_registry';
import { RequirementsContract } from './build/wrappers/requirements';
import { StakeContractContract } from './build/wrappers/stake_contract';
import { VolumeSubscriptionContract } from './build/wrappers/volume_subscription';

import { MockKyberNetworkContract } from './build/wrappers/mock_kyber_network';
import { MockTokenContract } from './build/wrappers/mock_token';
import { MockVolumeSubscriptionContract } from './build/wrappers/mock_volume_subscription';

export {
  ApprovedRegistryContract,
  ExecutorContract,
  PaymentRegistryContract,
  RequirementsContract,
  StakeContractContract as StakeContract,
  VolumeSubscriptionContract,
  MockKyberNetworkContract,
  MockTokenContract,
  MockVolumeSubscriptionContract
}

// Export all the addresses

import { config } from './build/addresses/config';
import { dependencies } from './build/addresses/dependencies';
import { tokens } from './build/addresses/tokens';

export {
  config as ConfigAddresses,
  dependencies as DependencyAddresses,
  tokens as TokenAddresses
}

// Export Utils

export { Web3Utils } from './src/utils/Web3Utils';