import { AddressBook } from '@8xprotocol/types'

import * as Web3 from 'web3';

import Contracts from './services/contracts';

import PlanAPI from './apis/plan_api';
import SubscriptionsAPI from './apis/subscriptions_api';

import VolumeSubscriptionWrapper from './wrappers/volume_subscription_wrapper';
import ExecutorWrapper from './wrappers/executor_wrapper';

export default class EightEx {

  private web3: Web3;
  private addressBook: AddressBook;
  private contracts: Contracts;

  private volumeSubscriptionWrapper: VolumeSubscriptionWrapper;
  private executorWrapper: ExecutorWrapper;

  public plans: PlanAPI;
  public subscriptions: SubscriptionsAPI;

  constructor(web3: Web3, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;

    this.contracts = new Contracts(web3, addressBook);

    this.volumeSubscriptionWrapper = new VolumeSubscriptionWrapper(web3, this.contracts);
    this

    this.plans = new PlanAPI(this.contracts, addressBook, this.volumeSubscriptionWrapper);

    this.subscriptions = new SubscriptionsAPI(
      this.contracts,
      addressBook,
      this.volumeSubscriptionWrapper,
      this.executorWrapper
    );

  }

}