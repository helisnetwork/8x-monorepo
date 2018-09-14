import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { BaseContract } from '@8xprotocol/base_contract';
import { TxData } from '@8xprotocol/types';
export declare class ExecutorContract extends BaseContract {
    requirementsContract: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    stakeContract: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    approvedRegistry: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    transferProxy: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    owner: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    lockUpPercentage: {
        callAsync(defaultBlock?: any): Promise<BigNumber>;
    };
    paymentRegistry: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    transferOwnership: {
        sendTransactionAsync(_newOwner: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_newOwner: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_newOwner: string, txData?: TxData): string;
        callAsync(_newOwner: string, txData?: TxData): Promise<void>;
    };
    maximumIntervalDivisor: {
        callAsync(defaultBlock?: any): Promise<BigNumber>;
    };
    setPercentageLockUp: {
        sendTransactionAsync(_percentage: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_percentage: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_percentage: BigNumber, txData?: TxData): string;
        callAsync(_percentage: BigNumber, txData?: TxData): Promise<void>;
    };
    setMaximumIntervalDivisor: {
        sendTransactionAsync(_divisor: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_divisor: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_divisor: BigNumber, txData?: TxData): string;
        callAsync(_divisor: BigNumber, txData?: TxData): Promise<void>;
    };
    activateSubscription: {
        sendTransactionAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): string;
        callAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<boolean>;
    };
    processSubscription: {
        sendTransactionAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): string;
        callAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<void>;
    };
    releaseSubscription: {
        sendTransactionAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): string;
        callAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<void>;
    };
    catchLateSubscription: {
        sendTransactionAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): string;
        callAsync(_subscriptionContract: string, _subscriptionIdentifier: string, txData?: TxData): Promise<void>;
    };
    determineStake: {
        sendTransactionAsync(_tokenAddress: string, _startDate: BigNumber, _interval: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_tokenAddress: string, _startDate: BigNumber, _interval: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_tokenAddress: string, _startDate: BigNumber, _interval: BigNumber, txData?: TxData): string;
        callAsync(_tokenAddress: string, _startDate: BigNumber, _interval: BigNumber, txData?: TxData): Promise<BigNumber>;
    };
    attemptProcessing: {
        sendTransactionAsync(_subscriptionContract: string, _subscriptionIdentifier: string, _tokenAddress: string, _serviceNode: string, _newLastPaymentDate: BigNumber, _amount: BigNumber, _fee: BigNumber, _staked: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionContract: string, _subscriptionIdentifier: string, _tokenAddress: string, _serviceNode: string, _newLastPaymentDate: BigNumber, _amount: BigNumber, _fee: BigNumber, _staked: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionContract: string, _subscriptionIdentifier: string, _tokenAddress: string, _serviceNode: string, _newLastPaymentDate: BigNumber, _amount: BigNumber, _fee: BigNumber, _staked: BigNumber, txData?: TxData): string;
        callAsync(_subscriptionContract: string, _subscriptionIdentifier: string, _tokenAddress: string, _serviceNode: string, _newLastPaymentDate: BigNumber, _amount: BigNumber, _fee: BigNumber, _staked: BigNumber, txData?: TxData): Promise<void>;
    };
    deploy(...args: any[]): Promise<any>;
    static deployed(web3: Web3, defaults: Partial<TxData>): Promise<ExecutorContract>;
    static at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<ExecutorContract>;
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>);
}
