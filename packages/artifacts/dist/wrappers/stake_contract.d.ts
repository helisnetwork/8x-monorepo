import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { BaseContract } from '@8xprotocol/base_contract';
import { TxData } from '@8xprotocol/types';
export declare class StakeContractContract extends BaseContract {
    addAuthorizedAddress: {
        sendTransactionAsync(_target: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_target: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_target: string, txData?: TxData): string;
        callAsync(_target: string, txData?: TxData): Promise<void>;
    };
    authorities: {
        callAsync(index_0: BigNumber, defaultBlock?: any): Promise<string>;
    };
    tokenContract: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    removeAuthorizedAddress: {
        sendTransactionAsync(_target: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_target: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_target: string, txData?: TxData): string;
        callAsync(_target: string, txData?: TxData): Promise<void>;
    };
    userStakes: {
        callAsync(index_0: string, index_1: string, defaultBlock?: any): Promise<[BigNumber, BigNumber]>;
    };
    owner: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    authorized: {
        callAsync(index_0: string, defaultBlock?: any): Promise<boolean>;
    };
    getAuthorizedAddresses: {
        callAsync(defaultBlock?: any): Promise<string[]>;
    };
    transferOwnership: {
        sendTransactionAsync(_newOwner: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_newOwner: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_newOwner: string, txData?: TxData): string;
        callAsync(_newOwner: string, txData?: TxData): Promise<void>;
    };
    setGiniCoefficient: {
        sendTransactionAsync(_tokenAddress: string, _gini: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, _gini: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, _gini: BigNumber, txData?: TxData): string;
        callAsync(_tokenAddress: string, _gini: BigNumber, txData?: TxData): Promise<void>;
    };
    setDivideTotalBy: {
        sendTransactionAsync(_tokenAddress: string, _divideBy: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, _divideBy: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, _divideBy: BigNumber, txData?: TxData): string;
        callAsync(_tokenAddress: string, _divideBy: BigNumber, txData?: TxData): Promise<void>;
    };
    lockTokens: {
        sendTransactionAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): string;
        callAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<void>;
    };
    unlockTokens: {
        sendTransactionAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): string;
        callAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<void>;
    };
    slashTokens: {
        sendTransactionAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): string;
        callAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, txData?: TxData): Promise<void>;
    };
    transferStake: {
        sendTransactionAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, _destination: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, _destination: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_staker: string, _tokenAddress: string, _amount: BigNumber, _destination: string, txData?: TxData): string;
        callAsync(_staker: string, _tokenAddress: string, _amount: BigNumber, _destination: string, txData?: TxData): Promise<void>;
    };
    getTotalStake: {
        callAsync(_staker: string, _tokenAddress: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getAvailableStake: {
        callAsync(_staker: string, _tokenAddress: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getLockedStake: {
        callAsync(_staker: string, _tokenAddress: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getTotalTokenStake: {
        callAsync(_tokenAddress: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getAvailableTokenStake: {
        callAsync(_tokenAddress: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getLockedTokenStake: {
        callAsync(_tokenAddress: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getTokenStakeDetails: {
        callAsync(_tokenAddress: string, defaultBlock?: any): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]>;
    };
    topUpStake: {
        sendTransactionAsync(_amount: BigNumber, _tokenAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_amount: BigNumber, _tokenAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_amount: BigNumber, _tokenAddress: string, txData?: TxData): string;
        callAsync(_amount: BigNumber, _tokenAddress: string, txData?: TxData): Promise<boolean>;
    };
    withdrawStake: {
        sendTransactionAsync(_amount: BigNumber, _tokenAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_amount: BigNumber, _tokenAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_amount: BigNumber, _tokenAddress: string, txData?: TxData): string;
        callAsync(_amount: BigNumber, _tokenAddress: string, txData?: TxData): Promise<void>;
    };
    deploy(...args: any[]): Promise<any>;
    static deployed(web3: Web3, defaults: Partial<TxData>): Promise<StakeContractContract>;
    static at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<StakeContractContract>;
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>);
}
