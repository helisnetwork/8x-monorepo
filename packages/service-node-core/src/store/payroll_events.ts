import Web3 = require("web3");
import * as ABIDecoder from 'abi-decoder';

import { PayrollSubscriptionAbi, PayrollSubscriptionContract } from '@8xprotocol/artifacts'

import { Store, SubscriptionEvent, PayrollScheduleEvent, PayrollPaymentEvent, BasicEvent } from '../types';
import { Address } from '@8xprotocol/types';
import { AbiDefinition } from "ethereum-types";

export default class EventStore implements Store {

  private web3: Web3;
  private payrollContract: PayrollSubscriptionContract;

  public eventsUpdated: () => (void);
  public payments: { [id: string] : PayrollPaymentEvent  } = {};
  public schedules: { [id: string] : PayrollScheduleEvent } = {};

  constructor(web3: Web3, payrollContract: PayrollSubscriptionContract, callback: () => (void)) {
    this.web3 = web3;
    this.eventsUpdated = callback;
    this.payrollContract = payrollContract;
  }

  public async startListening() {
    const contract = this.web3.eth.contract(PayrollSubscriptionAbi.abi as AbiDefinition[]).at(this.payrollContract.address);
    const eventsWatcher = contract.allEvents({
      fromBlock: 0,
      toBlock: "latest",
    });

    eventsWatcher.watch((error, log) => {
      if (log.event == 'CreatedSchedule') {
        this.handleCreatedSchedule(log);
      } else if (log.event == 'UpdatedSchedule') {
        this.handleUpdatedSchedule(log);
      } else if (log.event == 'TerminatedSchedule') {
        this.handleTerminatedSchedule(log);
      } else if (log.event == 'CreatedPayment') {
        this.handleCreatedPayment(log);
      } else if (log.event == 'LastUpdatedPaymentDate') {
        this.handleLastUpdatedPaymentDate(log);
      } else if (log.event == 'TerminatedPayment') {
        this.handleTerminatedPayment(log);
      }

      this.eventsUpdated();
    });
  }

  getEventsArray(): BasicEvent[] {
    return [];
  }

  private handleCreatedSchedule(log) {
    console.log(`Received Created Schedule: ${JSON.stringify(log, null, 2)}`);

    let newSchedule = {
      identifier: log.args.scheduleIdentifier,
      interval: log.args.interval.toNumber(),
      fee: log.args.fee.toNumber(),
      startDate: localStorage.args.startDate.toNumber(),
      oneOff: log.args.oneOff,
      transactionIndex: log.transactionIndex,
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
      terminationDate: 0,
    } as PayrollScheduleEvent

    this.schedules[newSchedule.identifier] = newSchedule;
  }

  private handleUpdatedSchedule(log) {
    console.log(`Received Updated Schedule: ${JSON.stringify(log, null, 2)}`);

    let existingSchedule = this.schedules[log.args.paymentIdentifier];

    if (log.blockNumber <= existingSchedule.blockNumber) {
      if (log.transactionIndex < existingSchedule.transactionIndex) {
        return;
      }
    }

    existingSchedule.fee = log.args.fee.toNumber();
    existingSchedule.startDate = log.args.startDate.toNumber();
    existingSchedule.interval = log.args.interval.toNumber();
    existingSchedule.blockNumber = log.blockNumber;
    existingSchedule.transactionIndex = log.blockNumber;
    existingSchedule.transactionHash = log.transactionHash;

    this.schedules[existingSchedule.identifier] = existingSchedule;
  }

  private handleTerminatedSchedule(log) {
    console.log(`Received Terminated Schedule: ${JSON.stringify(log, null, 2)}`);

    let existingSchedule = this.schedules[log.args.paymentIdentifier];

    if (log.blockNumber <= existingSchedule.blockNumber) {
      if (log.transactionIndex < existingSchedule.transactionIndex) {
        return;
      }
    }

    existingSchedule.terminationDate = log.args.terminationDate.toNumber();
    existingSchedule.blockNumber = log.blockNumber;
    existingSchedule.transactionIndex = log.blockNumber;
    existingSchedule.transactionHash = log.transactionHash;

    this.schedules[existingSchedule.identifier] = existingSchedule;
  }

  private handleCreatedPayment(log) {
    console.log(`Received Created Payment: ${JSON.stringify(log, null, 2)}`);

    let newEvent = {
      contractAddress: this.payrollContract.address,
      paymentIdentifier: log.args.employeeIdentifier,
      scheduleIdentifier: log.args.scheduleIdentifier,
      amount: log.args.amount,
      transactionIndex: log.transactionIndex,
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
    } as PayrollPaymentEvent

    this.payments[newEvent.scheduleIdentifier] = newEvent;
  }

  private handleLastUpdatedPaymentDate(log) {
    console.log(`Received Last Update Payment Date: ${JSON.stringify(log, null, 2)}`);

    let existingPayment = this.payments[log.args.paymentIdentifier];

    if (log.blockNumber <= existingPayment.blockNumber) {
      if (log.transactionIndex < existingPayment.transactionIndex) {
        return;
      }
    }

    existingPayment.lastPaymentDate = log.args.lastPaymentDate.toNumber();
    existingPayment.blockNumber = log.blockNumber;
    existingPayment.transactionIndex = log.blockNumber;
    existingPayment.transactionHash = log.transactionHash;

    this.payments[existingPayment.paymentIdentifier] = existingPayment;

  }

  private handleTerminatedPayment(log) {
    console.log(`Received Terminated Payment: ${JSON.stringify(log, null, 2)}`);

    let existingPayment = this.payments[log.args.paymentIdentifier];

    if (log.blockNumber <= existingPayment.blockNumber) {
      if (log.transactionIndex < existingPayment.transactionIndex) {
        return;
      }
    }

    existingPayment.terminationDate = log.args.terminationDate.toNumber();
    existingPayment.blockNumber = log.blockNumber;
    existingPayment.transactionIndex = log.blockNumber;
    existingPayment.transactionHash = log.transactionHash;

    this.payments[existingPayment.paymentIdentifier] = existingPayment;
  }

}