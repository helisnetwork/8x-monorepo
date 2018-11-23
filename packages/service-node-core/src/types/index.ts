import { Bytes32, Address } from "@8xprotocol/types";
import { BigNumber } from 'bignumber.js';

export interface BasicEvent {
  subscriptionAddress: Address,
  subscriptionIdentifier: Bytes32,
  dueDate: number,
  transactionHash: string,
  claimant: Address | null,
  cancelled: boolean,
}

export interface SubscriptionEvent extends BasicEvent {
  tokenAddress: Address,
  amount: BigNumber,
  fee: BigNumber,
  staked: BigNumber | null,
  executionPeriod: number | null,
  blockNumber: number,
  transactionIndex: number,
}