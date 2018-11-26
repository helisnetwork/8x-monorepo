import * as Web3 from 'web3';
import * as _ from 'lodash';
import * as abi from 'ethereumjs-abi';

import Contracts from '../services/contracts';
import BigNumber from 'bignumber.js';

import { Web3Utils, VolumeSubscriptionAbi, ExecutorContract } from '@8xprotocol/artifacts';
import { generateTxOpts } from '../utils/transaction_utils';
import { Address, Bytes32, TxData, TxHash, Plan, Subscription } from '@8xprotocol/types';
import { SECONDS_IN_DAY, EXECUTOR_CACHE_KEY } from '../constants';

import { getFormattedLogsFromTxHash, getFormattedLogsFromReceipt, formatLogEntry, getPastLogs } from '../utils/logs';

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
    imageUrl: string | null,
    metaData: JSON | null,
    txData?: TxData,
  ): Promise<Bytes32> {

    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let submitData: any = metaData || {};

    if (name) {
      submitData['name'] = name;
      submitData['description'] = description;
      submitData['imageUrl'] = imageUrl;
    }

    let submitString = (Object.keys(submitData).length > 0) ? JSON.stringify(submitData) : '';

    let txHash = await volumeSubscription.createPlan.sendTransactionAsync(
      owner,
      token,
      Web3Utils.asciiToHex(identifier),
      new BigNumber(interval),
      amount,
      fee,
      submitString,
      txSettings
    );

    let logs = await getFormattedLogsFromTxHash(this.web3, VolumeSubscriptionAbi.abi, txHash);

    // @TODO: Throw error if doesn't exist
    let planHash = _.get(logs[0].args, "planIdentifier") || '';

    return planHash;

  }


  public async terminatePlan(
    identifier: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    return await volumeSubscription.terminatePlan.sendTransactionAsync(
      identifier,
      new BigNumber(Date.now()).dividedToIntegerBy(1000).add(60*60*24),
      txSettings
    );

  }

  public async getPlan(
    planHash: Bytes32
  ): Promise<Plan> {

    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let [
      owner, tokenAddress, identifier, interval, amount, fee, data, terminationDate
    ] = await volumeSubscription.plans.callAsync(planHash);;

    identifier = Web3Utils.hexToUtf8(identifier);

    let parsedData = JSON.parse(data)

    let name: string;
    let description: string;
    let imageUrl: string;

    if (parsedData) {
      name = parsedData["name"] || '';
      description = parsedData["description"] || '';
      imageUrl = parsedData["imageUrl"] || '';
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
      imageUrl,
      planHash
    } as Plan;

  }

  public async getPlans(
    owner: string
  ): Promise<Plan[]> {

    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let logs = await getPastLogs(this.web3, volumeSubscription,'CreatedPlan');
    let filteredLogs = logs.filter((object) => {
      return object['args']['owner'] == owner;
    });
    let ids = filteredLogs.map((object) => _.get(object, 'args.planIdentifier'));

    let plans = ids.map(async(id) => {
      return await this.getPlan(id);
    });

    return await Promise.all(plans);

  }

  public async getSubscriptionsByUser(
    user: Address
  ): Promise<Subscription[]> {

   return await this.getSubscribersBy('owner', user);

  }

  public async getSubscriptionsByPlan(
    planHash: Bytes32
  ): Promise<Subscription[]> {

    return await this.getSubscribersBy('planIdentifier', planHash);

  }

  private async getSubscribersBy(
    key: string,
    value: string
  ): Promise<Subscription[]> {

    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let logs = await getPastLogs(this.web3, volumeSubscription, 'CreatedSubscription');

    let ids = logs.filter((object) => {
      return object['args'][key] == value;
    }).map((object) => {
      let filterKey = _.get(object, `args.${key}`);
      return filterKey == value ? _.get(object, 'args.paymentIdentifier') : null;
    }).filter((object) => object);

    let subscriptions = ids.map(async(id) => {
      return await this.getSubscription(id);
    });

    return await Promise.all(subscriptions);

  }

  public async subscribeAndActivate( 
    planHash: Bytes32,
    metaData: JSON | null,
    txData?: TxData 
  ): Promise<Bytes32> {
    
    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();
    const executor = await this.contracts.loadExecutor();
    const salt = ((Date.now()/1000) + (Math.random() * 10000)).toFixed(); 

    const computedSubscriptionHash = "0x" + abi.soliditySHA3(
      ["address", "bytes32", "uint"],
      [txSettings.from, planHash, salt]
    ).toString('hex');

    let txHash = await volumeSubscription.createSubscriptionAndCall.sendTransactionAsync(
      planHash,
      metaData ? JSON.stringify(metaData) : '',
      new BigNumber(salt),
      executor.address,
      'activateSubscription(address,bytes32)',
      txSettings
    );


    let logs = await getFormattedLogsFromTxHash(this.web3, VolumeSubscriptionAbi.abi, txHash);

    // @TODO: Throw error if doesn't exist
    let subscriptionHash = _.get(logs[0].args, "paymentIdentifier") || '';

    return subscriptionHash;
  }

  public async createSubscription(
    planHash: Bytes32,
    metaData: JSON | null,
    txData?: TxData
  ): Promise<Bytes32> {

    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let txHash = await volumeSubscription.createSubscription.sendTransactionAsync(
      planHash,
      metaData ? JSON.stringify(metaData) : '',
      txSettings
    );

    let logs = await getFormattedLogsFromTxHash(this.web3, VolumeSubscriptionAbi.abi, txHash);

    // @TODO: Throw error if doesn't exist
    let subscriptionHash = _.get(logs[0].args, "paymentIdentifier") || '';

    return subscriptionHash;

  }

  public async cancelPayment(
    subscriptionHash: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    const txSettings = await generateTxOpts(this.web3, txData);
    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    return await volumeSubscription.cancelPayment.sendTransactionAsync(
      subscriptionHash,
      txSettings
    );

  }

  public async getSubscription(
    subscriptionHash: Bytes32
  ) {

    const volumeSubscription = await this.contracts.loadVolumeSubscription();

    let [
      owner, tokenAddress, planHash, lastPaymentDate, terminationDate, data
    ] = await volumeSubscription.subscriptions.callAsync(
      subscriptionHash
    );

    return {
      owner,
      tokenAddress,
      planHash,
      lastPaymentDate: lastPaymentDate.toNumber(),
      terminationDate: terminationDate.toNumber(),
      data,
      subscriptionHash
    } as Subscription;

  }

  public async getSubscriptionState(
    subscriptionHash: Bytes32
  ) {

  }

}