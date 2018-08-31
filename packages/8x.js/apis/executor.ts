import { AddressBook } from "../types/address_book";
import * as Types from "../types/common";

export default class ExecutorAPI {

  public web3: any;
  public addressBook: AddressBook;

  constructor(web3: any, addressBook: AddressBook) {

  }

  public async activateSubscription(
    subscriptionContract: Types.Address,
    subscriptionIdentifier: Types.Bytes32
  ): Promise<boolean> {

    // @TODO: Implementation
    return Promise.resolve(true);

  }

  public async processSubscription(
    subscriptionContract: Types.Address,
    subscriptionIdentifier: Types.Bytes32
  ): Promise<boolean> {

    // @TODO: Implementation
    return Promise.resolve(true);

  }

  public async releaseSubscription(
    subscriptionContract: Types.Address,
    subscriptionIdentifier: Types.Bytes32
  ): Promise<boolean> {

    // @TODO: Implementation
    return Promise.resolve(true);

  }

  public async catchLateSubscription(
    subscriptionContract: Types.Address,
    subscriptionIdentifier: Types.Bytes32
  ): Promise<boolean> {

    // @TODO: Implementation
    return Promise.resolve(true);

  }

  public async cancelSubscription(
    subscriptionContract: Types.Address,
    subscriptionIdentifier: Types.Bytes32
  ): Promise<boolean> {

    // @TODO: Implementation
    return Promise.resolve(true);

  }

  public async determineStake(
    tokenAddress: Types.Address,
    startDate: Types.UInt,
    interval: Types.UInt
  ): Promise<boolean> {

    // @TODO: Implementation
    return Promise.resolve(true);

  }

}