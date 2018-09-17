import * as Web3 from 'web3';
import * as ABIDecoder from 'abi-decoder';
import * as _ from 'lodash';

import Contracts from '../services/contracts';
import BigNumber from 'bignumber.js';

import { Web3Utils, VolumeSubscriptionAbi } from '@8xprotocol/artifacts';
import { generateTxOpts } from '../utils/transaction_utils';
import { Address, Bytes32, TxData, Plan } from '@8xprotocol/types';
import { SECONDS_IN_DAY } from '../constants';

import { getFormattedLogsFromTxHash, getFormattedLogsFromReceipt, formatLogEntry } from '../utils/logs';

export default class VolumeSubscriptionWrapper {

  private web3: Web3;
  private contracts: Contracts;
  private web3Utils: Web3Utils;

  constructor(web3: Web3, contracts: Contracts) {
    this.web3 = web3;
    this.contracts = contracts;
    this.web3Utils = new Web3Utils(this.web3);
  }

  public async createPlan(
    owner: Address,
    token: Address,
    identifier: string,
    interval: number,
    amount: BigNumber,
    fee: BigNumber,
    name: string | null,
    description: string | null,
    metaData: JSON | null,
    txData?: TxData,
  ): Promise<Bytes32> {

    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let submitData: any = metaData || {};

    if (name) {
      submitData['name'] = name;
      submitData['description'] = description;
    }

    let submitString = (Object.keys(submitData).length > 0) ? JSON.stringify(submitData) : '';

    let txHash = await volumeSubscription.createPlan.sendTransactionAsync(
      owner,
      token,
      Web3Utils.asciiToHex(identifier),
      new BigNumber(interval).mul(SECONDS_IN_DAY),
      amount,
      fee,
      submitString,
      txSettings
    );

    let logs = await getFormattedLogsFromTxHash(this.web3, VolumeSubscriptionAbi.abi, txHash);

    // @TODO: Throw error if doesn't exist
    let planIdentifier = _.get(logs[0].args, "planIdentifier") || '';

    return planIdentifier;

  }


  public async terminatePlan(
    identifier: Bytes32,
    txData?: TxData
  ): Promise<boolean> {

    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    await volumeSubscription.terminatePlan.sendTransactionAsync(
      identifier,
      new BigNumber(Date.now()).dividedToIntegerBy(1000),
      txSettings
    );

    return Promise.resolve(true);

  }

  public async getPlan(
    planIdentifier: Bytes32
  ): Promise<Plan> {

    let volumeSubscription = await this.contracts.loadVolumeSubscription();

    let [
      owner, tokenAddress, identifier, interval, amount, fee, data, terminationDate
    ] = await volumeSubscription.plans.callAsync(planIdentifier);;

    identifier = Web3Utils.hexToUtf8(identifier);
    interval = interval.div(SECONDS_IN_DAY);

    let parsedData = JSON.parse(data)

    let name: string;
    let description: string;

    if (parsedData) {
      name = parsedData["name"] || ''
      description = parsedData["description"] || ''
    }

    return {
      owner,
      tokenAddress,
      identifier,
      interval: interval.toNumber(),
      amount,
      fee,
      data,
      terminationDate: terminationDate.toNumber(),
      name,
      description,
    } as Plan;

  }

  public async getPlans(
    owner: string
  ): Promise<[Plan]> {

    return

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