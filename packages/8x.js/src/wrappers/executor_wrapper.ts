import * as Web3 from 'web3';
import * as _ from 'lodash';

import BigNumber from 'bignumber.js';

import { Web3Utils } from '@8xprotocol/artifacts';
import { Address, Bytes32, TxData, TxHash } from '@8xprotocol/types';

import { generateTxOpts } from '../utils/transaction_utils';
import Contracts from '../services/contracts';

export default class ExecutorWrapper {

  private web3: Web3;
  private contracts: Contracts;
  private web3Utils: Web3Utils;

  constructor(web3: Web3, contracts: Contracts) {
    this.web3 = web3;
    this.contracts = contracts;
    this.web3Utils = new Web3Utils(this.web3);
  }

  public async activateSubscription(
    subscriptionContract: Address,
    subscriptionHash: Bytes32,
    txData?: TxData
  ): Promise<TxHash> {

    const txSettings = await generateTxOpts(this.web3, txData);

    let executor = await this.contracts.loadExecutor();

    return await executor.activateSubscription.sendTransactionAsync(
      subscriptionContract,
      subscriptionHash,
      txSettings
    );

  }

};