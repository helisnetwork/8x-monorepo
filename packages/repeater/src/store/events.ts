import * as Web3 from 'web3';
import { Executor } from '../../ts/Executor';
import { Address } from '@8xprotocol/types';

class EventStore {

  private web3: Web3;
  private executorAddress: Address;
  private executorContract: Executor | null;

  public eventsUpdated: () => string[];

  constructor(web3: Web3, executorAddress: Address, callback: () => string[]) {
    this.web3 = web3;
    this.executorAddress = executorAddress;
    this.eventsUpdated = callback;
    this.executorContract = null;
  }

  public async startListening() {
    this.executorContract = await Executor.at(this.executorAddress, this.web3, {});
  }

  public async getPastEvents() {
    //this.executorContract.events.SubscriptionActivated({}, {}).
  }

}