import Web3 = require("web3");

import { ExecutorAbi, ExecutorContract, StakeContract, MockTokenContract, Web3Utils, ApprovedRegistryContract, VolumeSubscriptionContract, PayrollSubscriptionContract } from '@8xprotocol/artifacts'
import EightEx from '8x.js';
import { AddressBook, Address } from '@8xprotocol/types';
import { BigNumber } from 'bignumber.js';

import { SubscriptionEvent, Store, DelayPeriod } from "./types";

import ExecutorStore from './store/executor_events';
import PayrollStore from './store/payroll_events';
import ProcessorStore from "./store/processor";

export default class Repeater {

  private web3: Web3;
  private eightEx: EightEx;
  private web3Utils: Web3Utils;
  private delayPeriods: DelayPeriod;

  private executorContract: ExecutorContract;
  private payrollContract: PayrollSubscriptionContract;

  private addressBook: AddressBook;
  private serviceNodeAccount: Address;

  public executorStore: ExecutorStore;
  public payrollStore: PayrollStore;

  public processorStore: ProcessorStore;

  public repeaterUpdated: () => (void) | null;

  constructor(web3: Web3, addressBook: AddressBook, serviceNodeAccount: Address, delayPeriods: DelayPeriod) {
    this.web3 = web3;
    this.web3Utils = new Web3Utils(web3);
    this.addressBook = addressBook;
    this.serviceNodeAccount = serviceNodeAccount;
    this.eightEx = new EightEx(web3, {});
    this.delayPeriods = delayPeriods;
  }

  public async start() {
    this.executorContract = await ExecutorContract.at(this.addressBook.executorAddress, this.web3, {});
    this.payrollContract = await PayrollSubscriptionContract.at(this.addressBook.payrollSubscriptionAddress, this.web3, {});

    this.executorStore = new ExecutorStore(this.web3, this.executorContract, () => this.storeUpdated(this.executorStore));
    this.payrollStore = new PayrollStore(this.web3, this.payrollContract, () => this.storeUpdated(this.payrollStore));

    this.processorStore = new ProcessorStore(this.web3, this.serviceNodeAccount, this.executorContract, this.delayPeriods);

    await this.executorStore.startListening();
  }

  public async attemptTopUp(amount: BigNumber, tokenAddress: Address, stakeTokenAddress: Address, stakeContractAddress: Address) {

    let stakeContract = await StakeContract.at(stakeContractAddress, this.web3, {});
    let stakeTokenContract = await MockTokenContract.at(stakeTokenAddress, this.web3, {});

    let existingBalance = await stakeContract.getTotalStake.callAsync(this.serviceNodeAccount, tokenAddress);

    if (existingBalance.toNumber() == amount.toNumber()) {
      console.log("Skipped top up");
      return '';
    }

    let approveTx = await stakeTokenContract.approve.sendTransactionAsync(
      stakeContract.address,
      amount,
      {from: this.serviceNodeAccount}
    );

    await this.eightEx.blockchain.awaitTransactionMinedAsync(approveTx);

    let topupTx = await stakeContract.topUpStake.sendTransactionAsync(
      amount,
      tokenAddress,
      {from: this.serviceNodeAccount}
    );

    await this.eightEx.blockchain.awaitTransactionMinedAsync(topupTx);
  }

  public storeUpdated(store: Store) {
    this.processorStore.setEvents(store.getEventsArray());
    this.repeaterUpdated();
  }

}