import * as Web3 from 'web3';
import * as _ from 'lodash';

import BigNumber from 'bignumber.js';

import { Web3Utils } from '@8xprotocol/artifacts';
import { Address, Bytes32, TxData, TxHash } from '@8xprotocol/types';

import { generateTxOpts } from '../utils/transaction_utils';
import Contracts from '../services/contracts';

export default class TokenWrapper {

  private web3: Web3;
  private contracts: Contracts;

  constructor(web3: Web3, contracts: Contracts) {
    this.web3 = web3;
    this.contracts = contracts;
  }

  public async allowance(
    token: Address,
    owner: Address,
    spender: Address
  ): Promise<BigNumber> {

    let tokenContract = await this.contracts.loadERC20Token(token);
    return tokenContract.allowance.callAsync(owner, spender);

  }

  public async balanceOf(
    token: Address,
    user: Address,
  ): Promise<BigNumber> {

    let tokenContract = await this.contracts.loadERC20Token(token);
    return tokenContract.balanceOf.callAsync(user);

  }

  public async giveApproval(
    token: Address,
    spender: Address,
    value: BigNumber,
    txData?: TxData
  ): Promise<TxHash> {

    const txSettings = await generateTxOpts(this.web3, txData);
    let tokenContract = await this.contracts.loadERC20Token(token);
    return tokenContract.approve.sendTransactionAsync(spender, value, txSettings);

  }

}