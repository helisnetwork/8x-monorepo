// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unused-variable
// tslint:disable:no-unbound-method
import { BaseContract } from '@0xproject/base-contract';
import { BlockParam, BlockParamLiteral, CallData, ContractAbi, ContractArtifact, DecodedLogArgs, MethodAbi, Provider, TxData, TxDataPayable } from 'ethereum-types';
import { BigNumber, classUtils, logUtils } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import * as ethers from 'ethers';
import * as _ from 'lodash';
// tslint:enable:no-unused-variable

export type VolumeSubscriptionEventArgs =
    | VolumeSubscriptionCreatedPlanEventArgs
    | VolumeSubscriptionUpdatedPlanEventArgs
    | VolumeSubscriptionTerminatedPlanEventArgs
    | VolumeSubscriptionCreatedSubscriptionEventArgs
    | VolumeSubscriptionLastSubscriptionPaymentDateEventArgs
    | VolumeSubscriptionUpdatedSubscriptionEventArgs
    | VolumeSubscriptionTerminatedSubscriptionEventArgs
    | VolumeSubscriptionLogAuthorizedAddressAddedEventArgs
    | VolumeSubscriptionLogAuthorizedAddressRemovedEventArgs
    | VolumeSubscriptionOwnershipTransferredEventArgs;

export enum VolumeSubscriptionEvents {
    CreatedPlan = 'CreatedPlan',
    UpdatedPlan = 'UpdatedPlan',
    TerminatedPlan = 'TerminatedPlan',
    CreatedSubscription = 'CreatedSubscription',
    LastSubscriptionPaymentDate = 'LastSubscriptionPaymentDate',
    UpdatedSubscription = 'UpdatedSubscription',
    TerminatedSubscription = 'TerminatedSubscription',
    LogAuthorizedAddressAdded = 'LogAuthorizedAddressAdded',
    LogAuthorizedAddressRemoved = 'LogAuthorizedAddressRemoved',
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface VolumeSubscriptionCreatedPlanEventArgs extends DecodedLogArgs {
    planIdentifier: string;
    businessIdentifier: string;
    owner: string;
}

export interface VolumeSubscriptionUpdatedPlanEventArgs extends DecodedLogArgs {
    planIdentifier: string;
    businessIdentifier: string;
    owner: string;
}

export interface VolumeSubscriptionTerminatedPlanEventArgs extends DecodedLogArgs {
    planIdentifier: string;
    businessIdentifier: string;
    owner: string;
    terminationDate: BigNumber;
}

export interface VolumeSubscriptionCreatedSubscriptionEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    planIdentifier: string;
    owner: string;
}

export interface VolumeSubscriptionLastSubscriptionPaymentDateEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    planIdentifier: string;
    owner: string;
    date: BigNumber;
}

export interface VolumeSubscriptionUpdatedSubscriptionEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    planIdentifier: string;
    owner: string;
}

export interface VolumeSubscriptionTerminatedSubscriptionEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    planIdentifier: string;
    owner: string;
    terminationDate: BigNumber;
}

export interface VolumeSubscriptionLogAuthorizedAddressAddedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}

export interface VolumeSubscriptionLogAuthorizedAddressRemovedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}

export interface VolumeSubscriptionOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class VolumeSubscriptionContract extends BaseContract {
    public gasCost = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'gasCost()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.gasCost(
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'gasCost'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public addAuthorizedAddress = {
        async sendTransactionAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('addAuthorizedAddress(address)').inputs;
            [_target
    ] = BaseContract._formatABIDataItemList(inputAbi, [_target
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_target
    ]);
            const encodedData = self._lookupEthersInterface('addAuthorizedAddress(address)').functions.addAuthorizedAddress(
                _target
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.addAuthorizedAddress.estimateGasAsync.bind(
                    self,
                    _target
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('addAuthorizedAddress(address)').inputs;
            [_target
    ] = BaseContract._formatABIDataItemList(inputAbi, [_target
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('addAuthorizedAddress(address)').functions.addAuthorizedAddress(
                _target
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _target: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('addAuthorizedAddress(address)').inputs;
            [_target
    ] = BaseContract._formatABIDataItemList(inputAbi, [_target
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('addAuthorizedAddress(address)').functions.addAuthorizedAddress(
                _target
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _target: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'addAuthorizedAddress(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_target
        ] = BaseContract._formatABIDataItemList(inputAbi, [_target
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_target
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.addAuthorizedAddress(
                _target
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'addAuthorizedAddress'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public authorities = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'authorities(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.authorities(
                index_0
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'authorities'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public approvedRegistry = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'approvedRegistry()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.approvedRegistry(
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'approvedRegistry'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public removeAuthorizedAddress = {
        async sendTransactionAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('removeAuthorizedAddress(address)').inputs;
            [_target
    ] = BaseContract._formatABIDataItemList(inputAbi, [_target
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_target
    ]);
            const encodedData = self._lookupEthersInterface('removeAuthorizedAddress(address)').functions.removeAuthorizedAddress(
                _target
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeAuthorizedAddress.estimateGasAsync.bind(
                    self,
                    _target
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('removeAuthorizedAddress(address)').inputs;
            [_target
    ] = BaseContract._formatABIDataItemList(inputAbi, [_target
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('removeAuthorizedAddress(address)').functions.removeAuthorizedAddress(
                _target
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _target: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('removeAuthorizedAddress(address)').inputs;
            [_target
    ] = BaseContract._formatABIDataItemList(inputAbi, [_target
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('removeAuthorizedAddress(address)').functions.removeAuthorizedAddress(
                _target
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _target: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'removeAuthorizedAddress(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_target
        ] = BaseContract._formatABIDataItemList(inputAbi, [_target
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_target
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.removeAuthorizedAddress(
                _target
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'removeAuthorizedAddress'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public owner = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'owner()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.owner(
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'owner'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public subscriptions = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, string, string, BigNumber, BigNumber, string]
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'subscriptions(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.subscriptions(
                index_0
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'subscriptions'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public plans = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, string, string, BigNumber, BigNumber, BigNumber, string, BigNumber]
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'plans(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.plans(
                index_0
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'plans'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public authorized = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'authorized(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.authorized(
                index_0
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'authorized'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getAuthorizedAddresses = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string[]
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getAuthorizedAddresses()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getAuthorizedAddresses(
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getAuthorizedAddresses'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(
            _newOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('transferOwnership(address)').inputs;
            [_newOwner
    ] = BaseContract._formatABIDataItemList(inputAbi, [_newOwner
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_newOwner
    ]);
            const encodedData = self._lookupEthersInterface('transferOwnership(address)').functions.transferOwnership(
                _newOwner
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.transferOwnership.estimateGasAsync.bind(
                    self,
                    _newOwner
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _newOwner: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('transferOwnership(address)').inputs;
            [_newOwner
    ] = BaseContract._formatABIDataItemList(inputAbi, [_newOwner
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('transferOwnership(address)').functions.transferOwnership(
                _newOwner
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _newOwner: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('transferOwnership(address)').inputs;
            [_newOwner
    ] = BaseContract._formatABIDataItemList(inputAbi, [_newOwner
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('transferOwnership(address)').functions.transferOwnership(
                _newOwner
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _newOwner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'transferOwnership(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_newOwner
        ] = BaseContract._formatABIDataItemList(inputAbi, [_newOwner
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_newOwner
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.transferOwnership(
                _newOwner
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'transferOwnership'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public gasPrice = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'gasPrice()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.gasPrice(
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'gasPrice'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public terminatePlan = {
        async sendTransactionAsync(
            _plan: string,
            _terminationDate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('terminatePlan(bytes32,uint256)').inputs;
            [_plan,
    _terminationDate
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _terminationDate
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_plan,
    _terminationDate
    ]);
            const encodedData = self._lookupEthersInterface('terminatePlan(bytes32,uint256)').functions.terminatePlan(
                _plan,
                _terminationDate
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.terminatePlan.estimateGasAsync.bind(
                    self,
                    _plan,
                    _terminationDate
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _plan: string,
            _terminationDate: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('terminatePlan(bytes32,uint256)').inputs;
            [_plan,
    _terminationDate
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _terminationDate
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('terminatePlan(bytes32,uint256)').functions.terminatePlan(
                _plan,
                _terminationDate
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _plan: string,
            _terminationDate: BigNumber,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('terminatePlan(bytes32,uint256)').inputs;
            [_plan,
    _terminationDate
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _terminationDate
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('terminatePlan(bytes32,uint256)').functions.terminatePlan(
                _plan,
                _terminationDate
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _plan: string,
            _terminationDate: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'terminatePlan(bytes32,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_plan,
        _terminationDate
        ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
        _terminationDate
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_plan,
        _terminationDate
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.terminatePlan(
                _plan,
                _terminationDate
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'terminatePlan'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public isValidSubscription = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'isValidSubscription(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.isValidSubscription(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'isValidSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getSubscriptionTokenAddress = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getSubscriptionTokenAddress(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getSubscriptionTokenAddress(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getSubscriptionTokenAddress'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getSubscriptionFromToAddresses = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, string]
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getSubscriptionFromToAddresses(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getSubscriptionFromToAddresses(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getSubscriptionFromToAddresses'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public getSubscriptionInterval = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getSubscriptionInterval(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getSubscriptionInterval(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getSubscriptionInterval'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getAmountDueFromSubscription = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getAmountDueFromSubscription(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getAmountDueFromSubscription(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getAmountDueFromSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getSubscriptionFee = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getSubscriptionFee(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getSubscriptionFee(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getSubscriptionFee'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getLastSubscriptionPaymentDate = {
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getLastSubscriptionPaymentDate(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getLastSubscriptionPaymentDate(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getLastSubscriptionPaymentDate'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getGasForExecution = {
        async callAsync(
            _subscription: string,
            _type: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'getGasForExecution(bytes32,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription,
        _type
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription,
        _type
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription,
        _type
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getGasForExecution(
                _subscription,
                _type
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'getGasForExecution'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setLastPaymentDate = {
        async sendTransactionAsync(
            _date: BigNumber,
            _subscription: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setLastPaymentDate(uint256,bytes32)').inputs;
            [_date,
    _subscription
    ] = BaseContract._formatABIDataItemList(inputAbi, [_date,
    _subscription
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_date,
    _subscription
    ]);
            const encodedData = self._lookupEthersInterface('setLastPaymentDate(uint256,bytes32)').functions.setLastPaymentDate(
                _date,
                _subscription
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setLastPaymentDate.estimateGasAsync.bind(
                    self,
                    _date,
                    _subscription
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _date: BigNumber,
            _subscription: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setLastPaymentDate(uint256,bytes32)').inputs;
            [_date,
    _subscription
    ] = BaseContract._formatABIDataItemList(inputAbi, [_date,
    _subscription
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setLastPaymentDate(uint256,bytes32)').functions.setLastPaymentDate(
                _date,
                _subscription
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _date: BigNumber,
            _subscription: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setLastPaymentDate(uint256,bytes32)').inputs;
            [_date,
    _subscription
    ] = BaseContract._formatABIDataItemList(inputAbi, [_date,
    _subscription
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setLastPaymentDate(uint256,bytes32)').functions.setLastPaymentDate(
                _date,
                _subscription
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _date: BigNumber,
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'setLastPaymentDate(uint256,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_date,
        _subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_date,
        _subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_date,
        _subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setLastPaymentDate(
                _date,
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'setLastPaymentDate'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public cancelSubscription = {
        async sendTransactionAsync(
            _subscription: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('cancelSubscription(bytes32)').inputs;
            [_subscription
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
    ]);
            const encodedData = self._lookupEthersInterface('cancelSubscription(bytes32)').functions.cancelSubscription(
                _subscription
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.cancelSubscription.estimateGasAsync.bind(
                    self,
                    _subscription
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscription: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('cancelSubscription(bytes32)').inputs;
            [_subscription
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('cancelSubscription(bytes32)').functions.cancelSubscription(
                _subscription
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _subscription: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('cancelSubscription(bytes32)').inputs;
            [_subscription
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('cancelSubscription(bytes32)').functions.cancelSubscription(
                _subscription
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscription: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'cancelSubscription(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.cancelSubscription(
                _subscription
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'cancelSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setGasPrice = {
        async sendTransactionAsync(
            _gasPrice: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setGasPrice(uint256)').inputs;
            [_gasPrice
    ] = BaseContract._formatABIDataItemList(inputAbi, [_gasPrice
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_gasPrice
    ]);
            const encodedData = self._lookupEthersInterface('setGasPrice(uint256)').functions.setGasPrice(
                _gasPrice
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setGasPrice.estimateGasAsync.bind(
                    self,
                    _gasPrice
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _gasPrice: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setGasPrice(uint256)').inputs;
            [_gasPrice
    ] = BaseContract._formatABIDataItemList(inputAbi, [_gasPrice
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setGasPrice(uint256)').functions.setGasPrice(
                _gasPrice
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _gasPrice: BigNumber,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setGasPrice(uint256)').inputs;
            [_gasPrice
    ] = BaseContract._formatABIDataItemList(inputAbi, [_gasPrice
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setGasPrice(uint256)').functions.setGasPrice(
                _gasPrice
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _gasPrice: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'setGasPrice(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_gasPrice
        ] = BaseContract._formatABIDataItemList(inputAbi, [_gasPrice
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_gasPrice
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setGasPrice(
                _gasPrice
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'setGasPrice'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setGasCost = {
        async sendTransactionAsync(
            _gasCost: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setGasCost(uint256)').inputs;
            [_gasCost
    ] = BaseContract._formatABIDataItemList(inputAbi, [_gasCost
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_gasCost
    ]);
            const encodedData = self._lookupEthersInterface('setGasCost(uint256)').functions.setGasCost(
                _gasCost
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setGasCost.estimateGasAsync.bind(
                    self,
                    _gasCost
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _gasCost: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setGasCost(uint256)').inputs;
            [_gasCost
    ] = BaseContract._formatABIDataItemList(inputAbi, [_gasCost
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setGasCost(uint256)').functions.setGasCost(
                _gasCost
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _gasCost: BigNumber,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setGasCost(uint256)').inputs;
            [_gasCost
    ] = BaseContract._formatABIDataItemList(inputAbi, [_gasCost
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setGasCost(uint256)').functions.setGasCost(
                _gasCost
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _gasCost: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'setGasCost(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_gasCost
        ] = BaseContract._formatABIDataItemList(inputAbi, [_gasCost
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_gasCost
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setGasCost(
                _gasCost
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'setGasCost'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public createPlan = {
        async sendTransactionAsync(
            _owner: string,
            _tokenAddress: string,
            _identifier: string,
            _interval: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('createPlan(address,address,bytes32,uint256,uint256,uint256,string)').inputs;
            [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ]);
            const encodedData = self._lookupEthersInterface('createPlan(address,address,bytes32,uint256,uint256,uint256,string)').functions.createPlan(
                _owner,
                _tokenAddress,
                _identifier,
                _interval,
                _amount,
                _fee,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.createPlan.estimateGasAsync.bind(
                    self,
                    _owner,
                    _tokenAddress,
                    _identifier,
                    _interval,
                    _amount,
                    _fee,
                    _data
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _owner: string,
            _tokenAddress: string,
            _identifier: string,
            _interval: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('createPlan(address,address,bytes32,uint256,uint256,uint256,string)').inputs;
            [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('createPlan(address,address,bytes32,uint256,uint256,uint256,string)').functions.createPlan(
                _owner,
                _tokenAddress,
                _identifier,
                _interval,
                _amount,
                _fee,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _owner: string,
            _tokenAddress: string,
            _identifier: string,
            _interval: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            _data: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('createPlan(address,address,bytes32,uint256,uint256,uint256,string)').inputs;
            [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_owner,
    _tokenAddress,
    _identifier,
    _interval,
    _amount,
    _fee,
    _data
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('createPlan(address,address,bytes32,uint256,uint256,uint256,string)').functions.createPlan(
                _owner,
                _tokenAddress,
                _identifier,
                _interval,
                _amount,
                _fee,
                _data
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _owner: string,
            _tokenAddress: string,
            _identifier: string,
            _interval: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            _data: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'createPlan(address,address,bytes32,uint256,uint256,uint256,string)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_owner,
        _tokenAddress,
        _identifier,
        _interval,
        _amount,
        _fee,
        _data
        ] = BaseContract._formatABIDataItemList(inputAbi, [_owner,
        _tokenAddress,
        _identifier,
        _interval,
        _amount,
        _fee,
        _data
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_owner,
        _tokenAddress,
        _identifier,
        _interval,
        _amount,
        _fee,
        _data
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.createPlan(
                _owner,
                _tokenAddress,
                _identifier,
                _interval,
                _amount,
                _fee,
                _data
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'createPlan'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public createSubscription = {
        async sendTransactionAsync(
            _planHash: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('createSubscription(bytes32,string)').inputs;
            [_planHash,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_planHash,
    _data
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_planHash,
    _data
    ]);
            const encodedData = self._lookupEthersInterface('createSubscription(bytes32,string)').functions.createSubscription(
                _planHash,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.createSubscription.estimateGasAsync.bind(
                    self,
                    _planHash,
                    _data
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _planHash: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('createSubscription(bytes32,string)').inputs;
            [_planHash,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_planHash,
    _data
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('createSubscription(bytes32,string)').functions.createSubscription(
                _planHash,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _planHash: string,
            _data: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('createSubscription(bytes32,string)').inputs;
            [_planHash,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_planHash,
    _data
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('createSubscription(bytes32,string)').functions.createSubscription(
                _planHash,
                _data
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _planHash: string,
            _data: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'createSubscription(bytes32,string)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_planHash,
        _data
        ] = BaseContract._formatABIDataItemList(inputAbi, [_planHash,
        _data
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_planHash,
        _data
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.createSubscription(
                _planHash,
                _data
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'createSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public setPlanOwner = {
        async sendTransactionAsync(
            _plan: string,
            _owner: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setPlanOwner(bytes32,address)').inputs;
            [_plan,
    _owner
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _owner
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_plan,
    _owner
    ]);
            const encodedData = self._lookupEthersInterface('setPlanOwner(bytes32,address)').functions.setPlanOwner(
                _plan,
                _owner
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setPlanOwner.estimateGasAsync.bind(
                    self,
                    _plan,
                    _owner
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _plan: string,
            _owner: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setPlanOwner(bytes32,address)').inputs;
            [_plan,
    _owner
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _owner
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setPlanOwner(bytes32,address)').functions.setPlanOwner(
                _plan,
                _owner
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _plan: string,
            _owner: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setPlanOwner(bytes32,address)').inputs;
            [_plan,
    _owner
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _owner
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setPlanOwner(bytes32,address)').functions.setPlanOwner(
                _plan,
                _owner
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _plan: string,
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'setPlanOwner(bytes32,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_plan,
        _owner
        ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
        _owner
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_plan,
        _owner
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setPlanOwner(
                _plan,
                _owner
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'setPlanOwner'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setPlanData = {
        async sendTransactionAsync(
            _plan: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setPlanData(bytes32,string)').inputs;
            [_plan,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _data
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_plan,
    _data
    ]);
            const encodedData = self._lookupEthersInterface('setPlanData(bytes32,string)').functions.setPlanData(
                _plan,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setPlanData.estimateGasAsync.bind(
                    self,
                    _plan,
                    _data
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _plan: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setPlanData(bytes32,string)').inputs;
            [_plan,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _data
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setPlanData(bytes32,string)').functions.setPlanData(
                _plan,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _plan: string,
            _data: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setPlanData(bytes32,string)').inputs;
            [_plan,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
    _data
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setPlanData(bytes32,string)').functions.setPlanData(
                _plan,
                _data
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _plan: string,
            _data: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'setPlanData(bytes32,string)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_plan,
        _data
        ] = BaseContract._formatABIDataItemList(inputAbi, [_plan,
        _data
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_plan,
        _data
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setPlanData(
                _plan,
                _data
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'setPlanData'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setSubscriptionData = {
        async sendTransactionAsync(
            _subscription: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setSubscriptionData(bytes32,string)').inputs;
            [_subscription,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription,
    _data
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription,
    _data
    ]);
            const encodedData = self._lookupEthersInterface('setSubscriptionData(bytes32,string)').functions.setSubscriptionData(
                _subscription,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setSubscriptionData.estimateGasAsync.bind(
                    self,
                    _subscription,
                    _data
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscription: string,
            _data: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setSubscriptionData(bytes32,string)').inputs;
            [_subscription,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription,
    _data
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setSubscriptionData(bytes32,string)').functions.setSubscriptionData(
                _subscription,
                _data
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _subscription: string,
            _data: string,
        ): string {
            const self = this as any as VolumeSubscriptionContract;
            const inputAbi = self._lookupAbi('setSubscriptionData(bytes32,string)').inputs;
            [_subscription,
    _data
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription,
    _data
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setSubscriptionData(bytes32,string)').functions.setSubscriptionData(
                _subscription,
                _data
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscription: string,
            _data: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as VolumeSubscriptionContract;
            const functionSignature = 'setSubscriptionData(bytes32,string)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscription,
        _data
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscription,
        _data
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscription,
        _data
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setSubscriptionData(
                _subscription,
                _data
            ) as ethers.CallDescription;
            const encodedData = ethersFunction.data;
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            let resultArray = ethersFunction.parse(rawCallResult);
            const outputAbi = (_.find(self.abi, {name: 'setSubscriptionData'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _approvedRegistryAddress: string,
    ): Promise<VolumeSubscriptionContract> {
        if (_.isUndefined(artifact.compilerOutput)) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return VolumeSubscriptionContract.deployAsync(bytecode, abi, provider, txDefaults, _approvedRegistryAddress
);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _approvedRegistryAddress: string,
    ): Promise<VolumeSubscriptionContract> {
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [_approvedRegistryAddress
] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [_approvedRegistryAddress
],
            BaseContract._bigNumberToString,
        );
        const txData = ethers.Contract.getDeployTransaction(bytecode, abi, _approvedRegistryAddress
);
        const web3Wrapper = new Web3Wrapper(provider);
        const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
            txData,
            txDefaults,
            web3Wrapper.estimateGasAsync.bind(web3Wrapper),
        );
        const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
        logUtils.log(`transactionHash: ${txHash}`);
        const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
        logUtils.log(`VolumeSubscription successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new VolumeSubscriptionContract(abi, txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [_approvedRegistryAddress
];
        return contractInstance;
    }
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
        super('VolumeSubscription', abi, address, provider, txDefaults);
        classUtils.bindAll(this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
