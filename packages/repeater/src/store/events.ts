import Web3 = require("web3");

import { Executor } from '../../build/Executor';
import { ExecutorAbi } from '@8xprotocol/artifacts';
import { Address } from '@8xprotocol/types';

export default class EventStore {

  private web3: Web3;
  private executorContract: Executor;

  public eventsUpdated: () => string[];

  constructor(web3: Web3, executorAddress: Address, callback: () => string[]) {
    this.web3 = web3;
    this.eventsUpdated = callback;
    this.executorContract = (new web3.eth.Contract(ExecutorAbi.abi, executorAddress)) as Executor;
  }

  public async startListening() {
    let subscription = await this.web3.eth.subscribe('logs', {
      address: this.executorContract.options.address,
    }, function(error, result){
      if (error) console.log(error);
    })

    subscription.on("data", function(trxData){
      console.log("Event received", trxData);
    });
  }

}