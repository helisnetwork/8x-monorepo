// Export TypeScript ABIs

import { ApprovedRegistry } from './build/abi/ts/ApprovedRegistry';
import { Executor } from './build/abi/ts/Executor';
import { PaymentRegistry } from './build/abi/ts/PaymentRegistry';
import { StakeContract } from './build/abi/ts/StakeContract';
import { VolumeSubscription } from './build/abi/ts/VolumeSubscription';
import { PayrollSubscription } from './build/abi/ts/PayrollSubscription';
import { TransferProxy } from './build/abi/ts/TransferProxy';

import { MockToken } from './build/abi/ts/MockToken';
import { MockVolumeSubscription } from './build/abi/ts/MockVolumeSubscription';
import { MockKyberNetwork } from './build/abi/ts/MockKyberNetwork';
import { MockPayrollSubscription } from './build/abi/ts/MockPayrollSubscription';

export {
  ApprovedRegistry as ApprovedRegistryAbi,
  Executor as ExecutorAbi,
  PaymentRegistry as PaymentRegistryAbi,
  StakeContract as StakeContractAbi,
  VolumeSubscription as VolumeSubscriptionAbi,
  TransferProxy as TransferProxyAbi,
  PayrollSubscription as PayrollSubscriptionAbi,
  MockKyberNetwork as MockKyberNetworkAbi,
  MockToken as MockTokenAbi,
  MockVolumeSubscription as MockVolumeSubscriptionAbi,
  MockPayrollSubscription as MockPayrollSubscriptionAbi
};

// Export contract wrappers

import { ApprovedRegistryContract } from './build/wrappers/approved_registry';
import { ExecutorContract } from './build/wrappers/executor';
import { PaymentRegistryContract } from './build/wrappers/payment_registry';
import { StakeContractContract } from './build/wrappers/stake_contract';
import { VolumeSubscriptionContract } from './build/wrappers/volume_subscription';
import { TransferProxyContract } from './build/wrappers/transfer_proxy';
import { PayrollSubscriptionContract } from './build/wrappers/payroll_subscription';

import { MockKyberNetworkContract } from './build/wrappers/mock_kyber_network';
import { MockTokenContract } from './build/wrappers/mock_token';
import { MockVolumeSubscriptionContract } from './build/wrappers/mock_volume_subscription';
import { MockPayrollSubscriptionContract } from './build/wrappers/mock_payroll_subscription';

export {
  ApprovedRegistryContract,
  ExecutorContract,
  PaymentRegistryContract,
  StakeContractContract as StakeContract,
  VolumeSubscriptionContract,
  PayrollSubscriptionContract,
  TransferProxyContract,
  MockKyberNetworkContract,
  MockTokenContract,
  MockVolumeSubscriptionContract,
  MockPayrollSubscriptionContract
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

export { Web3Utils } from './utils/Web3Utils';