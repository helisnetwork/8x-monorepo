import { TxData, TxDataPayable } from '@8xprotocol/types';

import Web3 = require('web3');
import * as _ from "lodash";

import Contract from 'web3/eth/contract';
import ABIDefinition from 'web3/eth/abi';

export default class BaseContract {
    public address: string;
    public abi: ABIDefinition[];

    public web3ContractInstance: Contract;

    protected defaults: Partial<TxData>;

    constructor(web3ContractInstance: Contract, defaults: Partial<TxData>) {
        this.web3ContractInstance = web3ContractInstance;
        this.address = web3ContractInstance.options.address;
        this.abi = web3ContractInstance.options.jsonInterface;
        this.defaults = defaults;
    }

    protected async applyDefaultsToTxDataAsync<T extends TxData | TxDataPayable>(
        txData: T,
        estimateGasAsync?: (txData: T) => Promise<number>,
    ): Promise<TxData> {
        // Gas amount sourced with the following priorities:
        // 1. Optional param passed in to public method call
        // 2. Global config passed in at library instantiation
        // 3. Gas estimate calculation + safety margin
        const removeUndefinedProperties = _.pickBy;
        const txDataWithDefaults = {
            ...removeUndefinedProperties(this.defaults),
            ...removeUndefinedProperties(txData as any),
            // HACK: TS can't prove that T is spreadable.
            // Awaiting https://github.com/Microsoft/TypeScript/pull/13288 to be merged
        };
        if (_.isUndefined(txDataWithDefaults.gas) && !_.isUndefined(estimateGasAsync)) {
            const estimatedGas = await estimateGasAsync(txData);
            txDataWithDefaults.gas = estimatedGas;
        }
        return txDataWithDefaults;
    }
}
