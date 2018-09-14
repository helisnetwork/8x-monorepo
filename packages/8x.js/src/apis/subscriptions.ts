import * as Types from '@8xprotocol/types';
import Contracts from '../services/contracts';

export default class Subscriptions {

  private contracts: Contracts;

  constructor(contracts: Contracts) {
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