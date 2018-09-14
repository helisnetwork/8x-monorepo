import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { BaseContract } from '@8xprotocol/base_contract';
import { TxData } from '@8xprotocol/types';
export declare class ApprovedRegistryContract extends BaseContract {
    wrappedEther: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    approvedContractArray: {
        callAsync(index_0: BigNumber, defaultBlock?: any): Promise<string>;
    };
    approvedContractMapping: {
        callAsync(index_0: string, defaultBlock?: any): Promise<boolean>;
    };
    approvedTokenArray: {
        callAsync(index_0: BigNumber, defaultBlock?: any): Promise<string>;
    };
    owner: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    approvedTokenMapping: {
        callAsync(index_0: string, defaultBlock?: any): Promise<BigNumber>;
    };
    kyberProxy: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    transferOwnership: {
        sendTransactionAsync(_newOwner: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_newOwner: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_newOwner: string, txData?: TxData): string;
        callAsync(_newOwner: string, txData?: TxData): Promise<void>;
    };
    getRateFor: {
        sendTransactionAsync(_tokenAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, txData?: TxData): string;
        callAsync(_tokenAddress: string, txData?: TxData): Promise<BigNumber>;
    };
    addApprovedContract: {
        sendTransactionAsync(_contractAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_contractAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_contractAddress: string, txData?: TxData): string;
        callAsync(_contractAddress: string, txData?: TxData): Promise<void>;
    };
    addApprovedToken: {
        sendTransactionAsync(_tokenAddress: string, _isWETH: boolean, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, _isWETH: boolean, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, _isWETH: boolean, txData?: TxData): string;
        callAsync(_tokenAddress: string, _isWETH: boolean, txData?: TxData): Promise<void>;
    };
    removeApprovedContract: {
        sendTransactionAsync(_contractAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_contractAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_contractAddress: string, txData?: TxData): string;
        callAsync(_contractAddress: string, txData?: TxData): Promise<void>;
    };
    removeApprovedToken: {
        sendTransactionAsync(_tokenAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, txData?: TxData): string;
        callAsync(_tokenAddress: string, txData?: TxData): Promise<void>;
    };
    getApprovedContracts: {
        callAsync(defaultBlock?: any): Promise<string[]>;
    };
    getApprovedTokens: {
        callAsync(defaultBlock?: any): Promise<string[]>;
    };
    isContractAuthorised: {
        sendTransactionAsync(_contractAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_contractAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_contractAddress: string, txData?: TxData): string;
        callAsync(_contractAddress: string, txData?: TxData): Promise<boolean>;
    };
    isTokenAuthorised: {
        sendTransactionAsync(_tokenAddress: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, txData?: TxData): string;
        callAsync(_tokenAddress: string, txData?: TxData): Promise<boolean>;
    };
    deploy(...args: any[]): Promise<any>;
    static deployed(web3: Web3, defaults: Partial<TxData>): Promise<ApprovedRegistryContract>;
    static at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<ApprovedRegistryContract>;
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>);
}
