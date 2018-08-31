import * as Types from "../types/common";

export default class VolumeSubscription {

  public async createPlan(
    owner: Types.Address,
    tokenAddress: Types.Address,
    identifier: string,
    interval: Types.UInt,
    amount: Types.UInt,
    fee: Types.UInt,
    data: string
  ): Promise<Types.Bytes32> {

    // @TODO: Implementation
    return Promise.resolve('todo');

  }

  public async updatePlanOwner(
    plan: Types.Bytes32,
    owner: Types.Address
  ): Promise<any> {

    // @TODO: Implementation

  }

  public async setPlanData(
    plan: Types.Bytes32,
    data: string
  ): Promise<any> {

    // @TODO: Implementation

  }

  public async terminatePlan(
    plan: Types.Bytes32,
    terminationDate: Types.UInt
  ): Promise<any> {

    // @TODO: Implementation

  }

  public async createSubscription(
    planHash: Types.Bytes32,
    data: string
  ): Promise<Types.Bytes32> {

    // @TODO: Implementation
    return Promise.resolve('todo');

  }

  public async setSubscriptionData(
    subscription: Types.Bytes32,
    data: string
  ): Promise<any> {

    // @TODO: Implementation

  }

  public async cancelSubscription(
    subscription: Types.Bytes32
  ) {

    // @TODO: Implementation

  }

}