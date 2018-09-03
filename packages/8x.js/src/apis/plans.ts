import * as Types from '../types/common';
import Contracts from '../helpers/contracts';

export default class Plans {

  private web3: any;
  private contracts: Contracts;

  constructor(web3: any, contracts: Contracts) {
    this.web3 = web3;
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
    let planHash = await volumeSubscription.createPlanTx(
      owner,
      token,
      identifier,
      interval,
      amount,
      fee,
      data
    ).send({});

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