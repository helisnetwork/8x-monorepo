import { BigNumber } from "bignumber.js";

import * as _ from "lodash";

export interface TxData {
    from?: string;
    gas?: BigNumber;
    gasPrice?: BigNumber;
    nonce?: BigNumber;
}

export interface TxDataPayable extends TxData {
    value?: BigNumber;
}

export interface Log {
    event: string;
    address: Address;
    args: any;
}

export interface ReceiptLog {
    name: string;
    events: Object[];
    address: string;
}

export interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: string[];
}

export declare type TransactionReceiptStatus = null | string | 0 | 1;

export interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    status: TransactionReceiptStatus;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: LogEntry[];
}

export interface MultiSigSubmissionEventArgs {
    transactionId: BigNumber;
}

export const classUtils = {
    // This is useful for classes that have nested methods. Nested methods don't get bound out of the box.
    bindAll(self: any, exclude: string[] = ["contructor"], thisArg?: any): void {
        for (const key of Object.getOwnPropertyNames(self)) {
            const val = self[key];
            if (!_.includes(exclude, key)) {
                if (_.isFunction(val)) {
                    self[key] = val.bind(thisArg || self);
                } else if (_.isObject(val)) {
                    classUtils.bindAll(val, exclude, self);
                }
            }
        }
        return self;
    },
};

export type Address = string;
export type UInt = BigNumber;
export type Bytes32 = string;

export enum SolidityType {
    address = "address",
    uint256 = "uint256",
    uint8 = "uint8",
    uint = "uint",
    bytes32 = "bytes32",
    boolean = "bool",
    string = "string",
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

export interface Plan {
    owner: Address,
    tokenAddress: Address,
    identifier: Bytes32,
    interval: number,
    amount: number,
    fee: number,
    data: string,
    name: string | null,
    description: string | null,
    terminationDate: number
}
