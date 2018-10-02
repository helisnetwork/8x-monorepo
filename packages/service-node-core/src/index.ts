import Web3 = require("web3");

import { ExecutorAbi, ExecutorContract, StakeContract, MockTokenContract, Web3Utils, ApprovedRegistryContract, VolumeSubscriptionContract } from '@8xprotocol/artifacts'
import EightEx from '8x.js';
import { AddressBook, Address } from '@8xprotocol/types';
import { BigNumber } from 'bignumber.js';

import SubscriptionEvent from "./types";

import EventStore from './store/events';
import ProcessorStore from "./store/processor";

export default class Repeater {

  private web3: Web3;
  private eightEx: EightEx;
  private web3Utils: Web3Utils;
  private executorContract: ExecutorContract;

  private executorAddress: Address;
  private serviceNodeAccount: Address;

  public eventStore: EventStore
  public processorStore: ProcessorStore;

  public repeaterUpdated: () => (void) | null;

  constructor(web3: Web3, executorAddress: Address, serviceNodeAccount: Address) {
    this.web3 = web3;
    this.web3Utils = new Web3Utils(web3);
    this.executorAddress = executorAddress;
    this.serviceNodeAccount = serviceNodeAccount;
    this.eightEx = new EightEx(web3, {});
  }

  public async start() {
    this.executorContract = await ExecutorContract.at(this.executorAddress, this.web3, {});

    this.eventStore = new EventStore(this.web3, this.executorContract, () => this.storeUpdated());
    this.processorStore = new ProcessorStore(this.web3, this.eightEx, this.serviceNodeAccount, this.executorContract);

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

  public storeUpdated() {
    this.processorStore.setEvents(Object.values(this.eventStore.events));
    this.repeaterUpdated();
  }

}