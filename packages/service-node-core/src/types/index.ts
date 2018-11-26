import Web3 = require("web3");

import { Bytes32, Address, AddressBook } from "@8xprotocol/types";
import { BigNumber } from 'bignumber.js';
import EightEx from "../../../8x.js/dist/types";

export interface TransactionEvent {
  transactionHash: string,
  transactionIndex: number,
  blockNumber: number
}

export interface BasicEvent extends TransactionEvent {
  contractAddress: Address,
  paymentIdentifier: Bytes32,
  dueDate: number,
  claimant: Address | null,
  cancelled: boolean,
  activated: boolean
}

export interface SubscriptionEvent extends BasicEvent {
  tokenAddress: Address,
  amount: BigNumber,
  fee: BigNumber,
  staked: BigNumber | null,
  executionPeriod: number | null,
}

export interface PayrollScheduleEvent extends TransactionEvent {
  identifier: Bytes32,
  interval: number,
  fee: number,
  startDate: number,
  terminationDate: number,
  oneOff: boolean,
}

export interface PayrollPaymentEvent extends BasicEvent {
  scheduleIdentifier: Bytes32,
  amount: BigNumber,
  lastPaymentDate: number,
  terminationDate: number,
}

export interface DelayPeriod {
  processing: number,
  catchLate: number,
  stopChecking: number
}

export interface Store {
  getEventsArray(): BasicEvent[];
}