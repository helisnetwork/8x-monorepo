import Web3 = require("web3");

import { ExecutorAbi, ExecutorContract, StakeContract, MockTokenContract } from '@8xprotocol/artifacts'
import { AddressBook, Address } from '@8xprotocol/types';
import { BigNumber } from 'bignumber.js';

import SubscriptionEvent from "./types";

import EventStore from './store/events';
import ProcessorStore from "./store/processor";

export default class Repeater {

  private web3: Web3;
  private executorContract: ExecutorContract;

  private executorAddress: Address;
  private serviceNodeAccount: Address;

  public eventStore: EventStore
  public processorStore: ProcessorStore;

  public repeaterUpdated: () => (void) | null;

  constructor(web3: Web3, executorAddress: Address, serviceNodeAccount: Address) {
    this.web3 = web3;
    this.executorAddress = executorAddress;
    this.serviceNodeAccount = serviceNodeAccount;
  }

  public async start() {
    this.executorContract = await ExecutorContract.at(this.executorAddress, this.web3, {});

    this.eventStore = new EventStore(this.web3, this.executorContract, () => this.storeUpdated());
    this.processorStore = new ProcessorStore(this.web3, this.serviceNodeAccount, this.executorContract);

    await this.eventStore.startListening();
  }

  public async attemptTopUp(amount: BigNumber, tokenAddress: Address, stakeTokenAddress: Address, stakeContractAddress: Address) {

    let stakeContract = await StakeContract.at(stakeContractAddress, this.web3, {});
    let stakeTokenContract = await MockTokenContract.at(stakeTokenAddress, this.web3, {});

    let existingBalance = await stakeContract.getTotalStake.callAsync(this.serviceNodeAccount, tokenAddress);

    if (existingBalance.toNumber() == amount.toNumber()) {
      console.log("Skipped top up");
      return '';
    }

    await stakeTokenContract.approve.sendTransactionAsync(
      stakeContract.address,
      amount,
      {from: this.serviceNodeAccount}
    );

    await stakeContract.topUpStake.sendTransactionAsync(
      amount,
      tokenAddress,
      {from: this.serviceNodeAccount}
    );
  }

  public storeUpdated() {
    this.processorStore.setEvents(Object.values(this.eventStore.events));
    this.repeaterUpdated();
  }

}