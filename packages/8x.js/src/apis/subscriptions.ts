import * as Types from '../types/common';
import Contracts from '../helpers/contracts';

export default class Subscriptions {

  private web3: any;
  private contracts: Contracts;

  constructor(web3: any, contracts: Contracts) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  public async subscribe(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

  public async create(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

  public async activate(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

  public async cancel(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

  public async get(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

  public async getSubscribed(
    contracts: [Types.Address],
    user: Types.Address
  ) {

  }

  public async getState(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

}