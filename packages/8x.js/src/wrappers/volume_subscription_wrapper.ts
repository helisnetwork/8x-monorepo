import * as Web3 from 'web3';

import { Address, Bytes32, TxData } from '@8xprotocol/types';
import Contracts from '../services/contracts';
import BigNumber from 'bignumber.js';

import { Web3Utils } from '@8xprotocol/artifacts';
import { generateTxOpts } from '../utils/transaction_utils';

export default class VolumeSubscriptionWrapper {

  private web3: Web3;
  private contracts: Contracts;

  constructor(web3: Web3, contracts: Contracts) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  public async createPlan(
    owner: Address,
    token: Address,
    identifier: string,
    interval: number,
    amount: number,
    fee: number,
    name: string | null,
    description: string | null,
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    const txSettings = await generateTxOpts(this.web3, txData);

    let volumeSubscription = await this.contracts.loadVolumeSubscription();
    let submitData: any = metaData || {};

    if (name) {
      submitData['name'] = name;
      submitData['description'] = description;
    }

    let submitString = (Object.keys(submitData).length > 0) ? JSON.stringify(submitData) : '';

    let planHash = await volumeSubscription.createPlan.sendTransactionAsync(
      owner,
      token,
      Web3Utils.soliditySHA3(identifier),
      new BigNumber(interval).mul(60*24*24),
      new BigNumber(amount).mul(10**16),
      new BigNumber(fee).mul(10**16),
      submitString,
      txSettings
    );

    return planHash;
  }

  public async cancelPlan(
    identifier: Bytes32
  ) {

  }

  public async getPlan(
    identifier: Bytes32
  ) {

  }

  public async getSubscribers(
    businessIdentifier?: Bytes32,
    planIdentifier?: Bytes32
  ) {

  }

  public async getPlanState(
    contract: Address,
    identifier: Bytes32
  ) {

  }
  public async createSubscription(
    identifier: Bytes32
  ) {

  }

  public async cancelSubscription(
    contract: Address,
    identifier: Bytes32
  ) {

  }

  public async getSubscription(
    contract: Address,
    identifier: Bytes32
  ) {

  }

  public async getSubscribed(
    user: Address
  ) {

  }

  public async getSubscriptionState(
    contract: Address,
    identifier: Bytes32
  ) {

  }

}