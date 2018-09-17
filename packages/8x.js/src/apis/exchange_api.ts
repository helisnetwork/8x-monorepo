import * as Web3 from 'web3';

import VolumeSubscriptionWrapper from '../wrappers/volume_subscription_wrapper';
import { TxData, Bytes32, Address, AddressBook, Plan } from '@8xprotocol/types';
import { BigNumber } from '@8xprotocol/types/node_modules/bignumber.js';

export default class ExchangeAPI {

  private web3: Web3;
  private addressBook: AddressBook;

  constructor(web3: Web3, addressBook: AddressBook) {
    this.web3 = web3;
    this.addressBook = addressBook;
  }

  public async getExchangeRate(
    sourceQuantity: BigNumber,
    from: Address,
    to: Address
  ): Promise<BigNumber> {

    return new BigNumber(0);

  }

  public async convert(
    sourceQuantity: BigNumber,
    from: Address,
    to: Address,
    txData?: TxData
  ): Promise<BigNumber> {

    return new BigNumber(0);

  }

}