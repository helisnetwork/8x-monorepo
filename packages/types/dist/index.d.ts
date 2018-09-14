import { BigNumber } from "bignumber.js";
export interface TxData {
    from?: string;
    gas?: number;
    gasPrice?: BigNumber;
    nonce?: number;
}
export interface TxDataPayable extends TxData {
    value?: BigNumber;
}
export interface MultiSigSubmissionEventArgs {
    transactionId: BigNumber;
}
export declare const classUtils: {
    bindAll(self: any, exclude?: string[], thisArg?: any): void;
};
export interface Log {
    event: string;
    args: object;
}
export declare type Address = string;
export declare type UInt = number | BigNumber;
export declare type Bytes32 = string;
export declare enum SolidityType {
    address = "address",
    uint256 = "uint256",
    uint8 = "uint8",
    uint = "uint",
    bytes32 = "bytes32",
    boolean = "bool",
    string = "string"
}
export interface AddressBook {
    actionProxyAddress?: string;
    approvedRegistryAddress?: string;
    executorAddress?: string;
    paymentRegistryAddress?: string;
    requirementsAddress?: string;
    stakeContractAddress?: string;
    transferProxyAddress?: string;
    volumeSubscriptionAddress?: string;
    daiAddress?: string;
}
