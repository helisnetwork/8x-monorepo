import { AddressBook } from './types/address_book';
import Contracts from './helpers/contracts';
import Subscriptions from './apis/subscriptions';
import Plans from './apis/plans';

export default class EightExJS {

  private web3: any;
  private addressBook: AddressBook;

  public contracts: Contracts;
  public subscriptions: Subscriptions;
  public plans: Plans;

  constructor(web3: any, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;

    this.contracts = new Contracts(web3, addressBook);
    this.subscriptions = new Subscriptions(web3, this.contracts);
    this.plans = new Plans(web3, this.contracts);
  }

}