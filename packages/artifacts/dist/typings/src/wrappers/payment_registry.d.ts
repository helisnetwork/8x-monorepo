import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { BaseContract } from '@8xprotocol/base_contract';
import { TxData } from '@8xprotocol/types';
export declare class PaymentRegistryContract extends BaseContract {
    payments: {
        callAsync(index_0: string, defaultBlock?: any): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]>;
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
    removeAuthorizedAddress: {
        sendTransactionAsync(_target: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_target: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_target: string, txData?: TxData): string;
        callAsync(_target: string, txData?: TxData): Promise<void>;
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
    createNewPayment: {
        sendTransactionAsync(_subscriptionIdentifier: string, _tokenAddress: string, _dueDate: BigNumber, _amount: BigNumber, _fee: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionIdentifier: string, _tokenAddress: string, _dueDate: BigNumber, _amount: BigNumber, _fee: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionIdentifier: string, _tokenAddress: string, _dueDate: BigNumber, _amount: BigNumber, _fee: BigNumber, txData?: TxData): string;
        callAsync(_subscriptionIdentifier: string, _tokenAddress: string, _dueDate: BigNumber, _amount: BigNumber, _fee: BigNumber, txData?: TxData): Promise<boolean>;
    };
    claimPayment: {
        sendTransactionAsync(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, _staked: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, _staked: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, _staked: BigNumber, txData?: TxData): string;
        callAsync(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, _staked: BigNumber, txData?: TxData): Promise<boolean>;
    };
    removeClaimant: {
        sendTransactionAsync(_subscriptionIdentifier: string, _claimant: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionIdentifier: string, _claimant: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionIdentifier: string, _claimant: string, txData?: TxData): string;
        callAsync(_subscriptionIdentifier: string, _claimant: string, txData?: TxData): Promise<boolean>;
    };
    transferClaimant: {
        sendTransactionAsync(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, txData?: TxData): string;
        callAsync(_subscriptionIdentifier: string, _claimant: string, _nextPayment: BigNumber, txData?: TxData): Promise<boolean>;
    };
    cancelPayment: {
        sendTransactionAsync(_subscriptionIdentifier: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionIdentifier: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionIdentifier: string, txData?: TxData): string;
        callAsync(_subscriptionIdentifier: string, txData?: TxData): Promise<boolean>;
    };
    deletePayment: {
        sendTransactionAsync(_subscriptionIdentifier: string, txData?: TxData): Promise<string>;
        estimateGasAsync(_subscriptionIdentifier: string, txData?: TxData): Promise<number>;
        getABIEncodedTransactionData(_subscriptionIdentifier: string, txData?: TxData): string;
        callAsync(_subscriptionIdentifier: string, txData?: TxData): Promise<void>;
    };
    getPaymentInformation: {
        callAsync(_subscriptionIdenitifer: string, defaultBlock?: any): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]>;
    };
    deploy(...args: any[]): Promise<any>;
    static deployed(web3: Web3, defaults: Partial<TxData>): Promise<PaymentRegistryContract>;
    static at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<PaymentRegistryContract>;
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>);
}
