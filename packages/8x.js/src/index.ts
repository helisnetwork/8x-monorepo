import { AddressBook } from '@8xprotocol/types'
import { Web3Wrapper } from '@0xproject/web3-wrapper';

import Contracts from './helpers/contracts';
import Subscriptions from './apis/subscriptions';
import Plans from './apis/plans';

export default class EightEx {

  private web3: Web3Wrapper;
  private addressBook: AddressBook;

  public contracts: Contracts;
  public subscriptions: Subscriptions;
  public plans: Plans;

  constructor(web3: Web3Wrapper, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;

    this.contracts = new Contracts(web3, addressBook);
    this.subscriptions = new Subscriptions(this.contracts);
    this.plans = new Plans(this.contracts, addressBook.daiAddress || '');
  }

}