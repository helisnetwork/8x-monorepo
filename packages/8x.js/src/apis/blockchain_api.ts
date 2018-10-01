'use strict';

import * as _ from 'lodash';
import * as Web3 from 'web3';
import { TransactionReceipt } from 'ethereum-types';

import { IntervalManager } from '../utils/interval_utils'
import { Web3Utils } from '@8xprotocol/artifacts';
import { TxHash } from '@8xprotocol/types';

export const BlockchainAPIErrors = {
  AWAIT_MINE_TX_TIMED_OUT: (txHash: string) =>
    `Timeout has been exceeded in awaiting mining of transaction with hash ${txHash}.`,
};

export const DEFAULT_TIMEOUT_FOR_TX_MINED = 60000;

/**
  * Blockchain
  *
  * @comment The blockchain API provides a convenient way to interact with the blockchain, such as waiting for a transaction to be processed.
  *
  * @path eightEx.blockchain
  *
*/

export class BlockchainAPI {
  private web3: Web3;
  private intervalManager: IntervalManager;
  private web3Utils: Web3Utils;

  constructor(web3: Web3 = undefined) {
    this.web3 = web3;
    this.intervalManager = new IntervalManager();
    this.web3Utils = new Web3Utils(this.web3);
  }

  /**
    * Wait for transaction
    *
    * @comment This function will wait until a transaction has been mined on the blockchain. Especially
    * useuful for providing end users with feedback on the status of their transaction.
    *
    * @param txHash                 Hash of the transaction
    * @param pollingIntervalMs      How often would you like the blockchain to be polled. Default value is set at 1,000ms (1s)
    * @param timeoutMs              After how long should the operation timeout.  Default value is set at 60,000ms (6s).
    *
    * @path eightEx.plans
    *
  */
  public async awaitTransactionMinedAsync(
    txHash: TxHash,
    pollingIntervalMs = 1000,
    timeoutMs = DEFAULT_TIMEOUT_FOR_TX_MINED,
  ): Promise<TransactionReceipt> {

    const intervalManager = this.intervalManager;
    const web3Utils = this.web3Utils;

    return new Promise<TransactionReceipt>((resolve, reject) => {
      intervalManager.setInterval(
        txHash,
        async () => {
          try {
            const receipt = await web3Utils.getTransactionReceiptAsync(txHash);
            if (receipt) {
              resolve(receipt);
              // Stop the interval.
              return false;
            } else {
              // Continue the interval.
              return true;
            }
          } catch (e) {
            reject(e);
          }
        },
        async () => {
          reject(new Error(BlockchainAPIErrors.AWAIT_MINE_TX_TIMED_OUT(txHash)));
        },
        pollingIntervalMs,
        timeoutMs,
      );
    });

  }
}
