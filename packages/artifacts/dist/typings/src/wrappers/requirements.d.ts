import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { BaseContract } from '@8xprotocol/base_contract';
import { TxData } from '@8xprotocol/types';
export declare class RequirementsContract extends BaseContract {
    owner: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    transferOwnership: {
        sendTransactionAsync(_newOwner: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_newOwner: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_newOwner: string, txData?: TxData): string;
        callAsync(_newOwner: string, txData?: TxData): Promise<void>;
    };
    getStake: {
        callAsync(_gini: BigNumber, _divideBy: BigNumber, _startDate: BigNumber, _claimDate: BigNumber, _maximumClaimDate: BigNumber, _totalUnlocked: BigNumber, defaultBlock?: any): Promise<BigNumber>;
    };
    deploy(...args: any[]): Promise<any>;
    static deployed(web3: Web3, defaults: Partial<TxData>): Promise<RequirementsContract>;
    static at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<RequirementsContract>;
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>);
}
