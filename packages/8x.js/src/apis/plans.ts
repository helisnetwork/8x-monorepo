import * as Types from '@8xprotocol/types';
import Contracts from '../helpers/contracts';

export default class Plans {

  private contracts: Contracts;
  private daiAddress: Types.Address;

  constructor(contracts: Contracts, daiAddress: Types.Address) {
    this.contracts = contracts;
    this.daiAddress = daiAddress;
  }

  /**
   * Create a subscription plan
   *
   * A subscription plan is created in order to provide an instance for a consumer to
   * subscribe to. A consumer can create their own plan allowing for custom subscription
   * payments.
   *
   * @param owner         Owner of the subscription
   * @param identifier    External identifier to use to retrieve subscribers
   * @param interval      Interval, in days, to charge a user
   * @param amount        Amount, in cents, to charge a use
   * @param fee           Amount, in cents, to set as the processing fee
   * @param name          Your organisation/name (eg 'Netflix', 'SaaS dApp'). Shown to user.
   * @param description   Description for your plan (eg 'Premium Plan'). Shown to user.
   * @param metaData      Any extra data you'd like to store on-chain (JSON format)
   */
  public async create(
    owner: Types.Address,
    identifier: string,
    interval: Types.UInt,
    amount: Types.UInt,
    fee: Types.UInt,
    name: string | null,
    description: string | null,
    metaData: JSON | null
  ): Promise<Types.Bytes32> {

    let volumeSubscription = await this.contracts.loadVolumeSubscription();

    let submitData: any = metaData || {};

    if (name) {
      submitData['name'] = name;
      submitData['description'] = description;
    }

    let submitString = (Object.keys(submitData).length > 0) ? JSON.stringify(submitData) : '';

    let planHash = await volumeSubscription.createPlan.callAsync(
      owner,
      this.daiAddress,
      identifier,
      interval,
      amount,
      fee,
      submitString
    );

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