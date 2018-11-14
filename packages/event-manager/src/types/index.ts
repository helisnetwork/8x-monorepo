import { Bytes32, Address } from "@8xprotocol/types";
import { BigNumber } from 'bignumber.js';

export default interface SubscriptionEvent {
  subscriptionAddress: Address,
  subscriptionIdentifier: Bytes32,
  tokenAddress: Address,
  dueDate: number,
  amount: BigNumber,
  fee: BigNumber,
  claimant: Address | null,
  staked: BigNumber | null,
  executionPeriod: number | null,
  blockNumber: number,
  transactionIndex: number,
  transactionHash: string,
  cancelled: boolean,
}