import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { BaseContract } from '@8xprotocol/base_contract';
import { TxData } from '@8xprotocol/types';
export declare class VolumeSubscriptionContract extends BaseContract {
    gasCost: {
        callAsync(defaultBlock?: any): Promise<BigNumber>;
    };
    addAuthorizedAddress: {
        sendTransactionAsync(_target: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_target: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_target: string, txData?: TxData): string;
        callAsync(_target: string, txData?: TxData): Promise<void>;
    };
    authorities: {
        callAsync(index_0: BigNumber, defaultBlock?: any): Promise<string>;
    };
    approvedRegistry: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    removeAuthorizedAddress: {
        sendTransactionAsync(_target: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_target: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_target: string, txData?: TxData): string;
        callAsync(_target: string, txData?: TxData): Promise<void>;
    };
    owner: {
        callAsync(defaultBlock?: any): Promise<string>;
    };
    subscriptions: {
        callAsync(index_0: string, defaultBlock?: any): Promise<[string, string, string, BigNumber, BigNumber, string]>;
    };
    plans: {
        callAsync(index_0: string, defaultBlock?: any): Promise<[string, string, string, BigNumber, BigNumber, BigNumber, string, BigNumber]>;
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
    gasPrice: {
        callAsync(defaultBlock?: any): Promise<BigNumber>;
    };
    terminatePlan: {
        sendTransactionAsync(_plan: string, _terminationDate: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_plan: string, _terminationDate: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_plan: string, _terminationDate: BigNumber, txData?: TxData): string;
        callAsync(_plan: string, _terminationDate: BigNumber, txData?: TxData): Promise<void>;
    };
    isValidSubscription: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<boolean>;
    };
    getSubscriptionTokenAddress: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<string>;
    };
    getSubscriptionFromToAddresses: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<[string, string]>;
    };
    getSubscriptionInterval: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getAmountDueFromSubscription: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getSubscriptionFee: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getLastSubscriptionPaymentDate: {
        callAsync(_subscription: string, defaultBlock?: any): Promise<BigNumber>;
    };
    getGasForExecution: {
        callAsync(_subscription: string, _type: BigNumber, defaultBlock?: any): Promise<[BigNumber, BigNumber]>;
    };
    setLastPaymentDate: {
        sendTransactionAsync(_date: BigNumber, _subscription: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_date: BigNumber, _subscription: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_date: BigNumber, _subscription: string, txData?: TxData): string;
        callAsync(_date: BigNumber, _subscription: string, txData?: TxData): Promise<void>;
    };
    cancelSubscription: {
        sendTransactionAsync(_subscription: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscription: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscription: string, txData?: TxData): string;
        callAsync(_subscription: string, txData?: TxData): Promise<void>;
    };
    setGasPrice: {
        sendTransactionAsync(_gasPrice: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_gasPrice: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_gasPrice: BigNumber, txData?: TxData): string;
        callAsync(_gasPrice: BigNumber, txData?: TxData): Promise<void>;
    };
    setGasCost: {
        sendTransactionAsync(_gasCost: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_gasCost: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_gasCost: BigNumber, txData?: TxData): string;
        callAsync(_gasCost: BigNumber, txData?: TxData): Promise<void>;
    };
    createPlan: {
        sendTransactionAsync(_owner: string, _tokenAddress: string, _identifier: string, _interval: BigNumber, _amount: BigNumber, _fee: BigNumber, _data: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_owner: string, _tokenAddress: string, _identifier: string, _interval: BigNumber, _amount: BigNumber, _fee: BigNumber, _data: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_owner: string, _tokenAddress: string, _identifier: string, _interval: BigNumber, _amount: BigNumber, _fee: BigNumber, _data: string, txData?: TxData): string;
        callAsync(_owner: string, _tokenAddress: string, _identifier: string, _interval: BigNumber, _amount: BigNumber, _fee: BigNumber, _data: string, txData?: TxData): Promise<string>;
    };
    createSubscription: {
        sendTransactionAsync(_planHash: string, _data: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_planHash: string, _data: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_planHash: string, _data: string, txData?: TxData): string;
        callAsync(_planHash: string, _data: string, txData?: TxData): Promise<string>;
    };
    setPlanOwner: {
        sendTransactionAsync(_plan: string, _owner: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_plan: string, _owner: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_plan: string, _owner: string, txData?: TxData): string;
        callAsync(_plan: string, _owner: string, txData?: TxData): Promise<void>;
    };
    setPlanData: {
        sendTransactionAsync(_plan: string, _data: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_plan: string, _data: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_plan: string, _data: string, txData?: TxData): string;
        callAsync(_plan: string, _data: string, txData?: TxData): Promise<void>;
    };
    setSubscriptionData: {
        sendTransactionAsync(_subscription: string, _data: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscription: string, _data: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscription: string, _data: string, txData?: TxData): string;
        callAsync(_subscription: string, _data: string, txData?: TxData): Promise<void>;
    };
    deploy(...args: any[]): Promise<any>;
    static deployed(web3: Web3, defaults: Partial<TxData>): Promise<VolumeSubscriptionContract>;
    static at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<VolumeSubscriptionContract>;
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>);
}
