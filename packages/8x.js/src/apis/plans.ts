import * as Types from '@8xprotocol/types'
import Contracts from '../helpers/contracts';

export default class Plans {

  private contracts: Contracts;

  constructor(contracts: Contracts) {
    this.contracts = contracts;
  }

  public async create(
    owner: Types.Address,
    token: Types.Address,
    identifier: string,
    interval: Types.UInt,
    amount: Types.UInt,
    fee: Types.UInt,
    data: string
  ): Promise<Types.Bytes32> {

    let volumeSubscription = await this.contracts.loadVolumeSubscription();
    let planHash = await volumeSubscription.createPlan.sendTransactionAsync(
      owner,
      token,
      identifier,
      interval,
      amount,
      fee,
      data
    )

    return planHash;
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

  public async getSubscribers(
    contracts: [Types.Address],
    businessIdentifier?: Types.Bytes32,
    planIdentifier?: Types.Bytes32
  ) {

  }

  public async getState(
    contract: Types.Address,
    identifier: Types.Bytes32
  ) {

  }

}