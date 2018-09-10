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

export type PaymentRegistryEventArgs =
    | PaymentRegistryPaymentCreatedEventArgs
    | PaymentRegistryPaymentClaimedEventArgs
    | PaymentRegistryPaymentClaimantRemovedEventArgs
    | PaymentRegistryPaymentClaimantTransferredEventArgs
    | PaymentRegistryPaymentCancelledEventArgs
    | PaymentRegistryPaymentDeletedEventArgs
    | PaymentRegistryDebugEventArgs
    | PaymentRegistryLogAuthorizedAddressAddedEventArgs
    | PaymentRegistryLogAuthorizedAddressRemovedEventArgs
    | PaymentRegistryOwnershipTransferredEventArgs;

export enum PaymentRegistryEvents {
    PaymentCreated = 'PaymentCreated',
    PaymentClaimed = 'PaymentClaimed',
    PaymentClaimantRemoved = 'PaymentClaimantRemoved',
    PaymentClaimantTransferred = 'PaymentClaimantTransferred',
    PaymentCancelled = 'PaymentCancelled',
    PaymentDeleted = 'PaymentDeleted',
    Debug = 'Debug',
    LogAuthorizedAddressAdded = 'LogAuthorizedAddressAdded',
    LogAuthorizedAddressRemoved = 'LogAuthorizedAddressRemoved',
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface PaymentRegistryPaymentCreatedEventArgs extends DecodedLogArgs {
    subscriptionIdentifer: string;
}

export interface PaymentRegistryPaymentClaimedEventArgs extends DecodedLogArgs {
    subscriptionIdentifer: string;
    claimant: string;
}

export interface PaymentRegistryPaymentClaimantRemovedEventArgs extends DecodedLogArgs {
    subscriptionIdentifer: string;
    claimant: string;
}

export interface PaymentRegistryPaymentClaimantTransferredEventArgs extends DecodedLogArgs {
    subscriptionIdentifer: string;
    claimant: string;
}

export interface PaymentRegistryPaymentCancelledEventArgs extends DecodedLogArgs {
    subscriptionIdentifer: string;
}

export interface PaymentRegistryPaymentDeletedEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
}

export interface PaymentRegistryDebugEventArgs extends DecodedLogArgs {
    one: BigNumber;
    two: BigNumber;
}

export interface PaymentRegistryLogAuthorizedAddressAddedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}

export interface PaymentRegistryLogAuthorizedAddressRemovedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}

export interface PaymentRegistryOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class PaymentRegistryContract extends BaseContract {
    public payments = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'payments(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.payments(
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
            const outputAbi = (_.find(self.abi, {name: 'payments'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public addAuthorizedAddress = {
        async sendTransactionAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
    public removeAuthorizedAddress = {
        async sendTransactionAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
    public authorized = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
            const self = this as any as PaymentRegistryContract;
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
    public createNewPayment = {
        async sendTransactionAsync(
            _subscriptionIdentifier: string,
            _tokenAddress: string,
            _dueDate: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('createNewPayment(bytes32,address,uint256,uint256,uint256)').inputs;
            [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ]);
            const encodedData = self._lookupEthersInterface('createNewPayment(bytes32,address,uint256,uint256,uint256)').functions.createNewPayment(
                _subscriptionIdentifier,
                _tokenAddress,
                _dueDate,
                _amount,
                _fee
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.createNewPayment.estimateGasAsync.bind(
                    self,
                    _subscriptionIdentifier,
                    _tokenAddress,
                    _dueDate,
                    _amount,
                    _fee
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionIdentifier: string,
            _tokenAddress: string,
            _dueDate: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('createNewPayment(bytes32,address,uint256,uint256,uint256)').inputs;
            [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('createNewPayment(bytes32,address,uint256,uint256,uint256)').functions.createNewPayment(
                _subscriptionIdentifier,
                _tokenAddress,
                _dueDate,
                _amount,
                _fee
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
            _subscriptionIdentifier: string,
            _tokenAddress: string,
            _dueDate: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
        ): string {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('createNewPayment(bytes32,address,uint256,uint256,uint256)').inputs;
            [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _tokenAddress,
    _dueDate,
    _amount,
    _fee
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('createNewPayment(bytes32,address,uint256,uint256,uint256)').functions.createNewPayment(
                _subscriptionIdentifier,
                _tokenAddress,
                _dueDate,
                _amount,
                _fee
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionIdentifier: string,
            _tokenAddress: string,
            _dueDate: BigNumber,
            _amount: BigNumber,
            _fee: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'createNewPayment(bytes32,address,uint256,uint256,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdentifier,
        _tokenAddress,
        _dueDate,
        _amount,
        _fee
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
        _tokenAddress,
        _dueDate,
        _amount,
        _fee
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
        _tokenAddress,
        _dueDate,
        _amount,
        _fee
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.createNewPayment(
                _subscriptionIdentifier,
                _tokenAddress,
                _dueDate,
                _amount,
                _fee
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
            const outputAbi = (_.find(self.abi, {name: 'createNewPayment'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public claimPayment = {
        async sendTransactionAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            _staked: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('claimPayment(bytes32,address,uint256,uint256)').inputs;
            [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ]);
            const encodedData = self._lookupEthersInterface('claimPayment(bytes32,address,uint256,uint256)').functions.claimPayment(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment,
                _staked
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.claimPayment.estimateGasAsync.bind(
                    self,
                    _subscriptionIdentifier,
                    _claimant,
                    _nextPayment,
                    _staked
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            _staked: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('claimPayment(bytes32,address,uint256,uint256)').inputs;
            [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('claimPayment(bytes32,address,uint256,uint256)').functions.claimPayment(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment,
                _staked
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
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            _staked: BigNumber,
        ): string {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('claimPayment(bytes32,address,uint256,uint256)').inputs;
            [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment,
    _staked
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('claimPayment(bytes32,address,uint256,uint256)').functions.claimPayment(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment,
                _staked
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            _staked: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'claimPayment(bytes32,address,uint256,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdentifier,
        _claimant,
        _nextPayment,
        _staked
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
        _claimant,
        _nextPayment,
        _staked
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
        _claimant,
        _nextPayment,
        _staked
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.claimPayment(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment,
                _staked
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
            const outputAbi = (_.find(self.abi, {name: 'claimPayment'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public removeClaimant = {
        async sendTransactionAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('removeClaimant(bytes32,address)').inputs;
            [_subscriptionIdentifier,
    _claimant
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
    _claimant
    ]);
            const encodedData = self._lookupEthersInterface('removeClaimant(bytes32,address)').functions.removeClaimant(
                _subscriptionIdentifier,
                _claimant
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeClaimant.estimateGasAsync.bind(
                    self,
                    _subscriptionIdentifier,
                    _claimant
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('removeClaimant(bytes32,address)').inputs;
            [_subscriptionIdentifier,
    _claimant
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('removeClaimant(bytes32,address)').functions.removeClaimant(
                _subscriptionIdentifier,
                _claimant
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
            _subscriptionIdentifier: string,
            _claimant: string,
        ): string {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('removeClaimant(bytes32,address)').inputs;
            [_subscriptionIdentifier,
    _claimant
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('removeClaimant(bytes32,address)').functions.removeClaimant(
                _subscriptionIdentifier,
                _claimant
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'removeClaimant(bytes32,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdentifier,
        _claimant
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
        _claimant
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
        _claimant
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.removeClaimant(
                _subscriptionIdentifier,
                _claimant
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
            const outputAbi = (_.find(self.abi, {name: 'removeClaimant'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public transferClaimant = {
        async sendTransactionAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('transferClaimant(bytes32,address,uint256)').inputs;
            [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ]);
            const encodedData = self._lookupEthersInterface('transferClaimant(bytes32,address,uint256)').functions.transferClaimant(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.transferClaimant.estimateGasAsync.bind(
                    self,
                    _subscriptionIdentifier,
                    _claimant,
                    _nextPayment
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('transferClaimant(bytes32,address,uint256)').inputs;
            [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('transferClaimant(bytes32,address,uint256)').functions.transferClaimant(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment
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
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
        ): string {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('transferClaimant(bytes32,address,uint256)').inputs;
            [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
    _claimant,
    _nextPayment
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('transferClaimant(bytes32,address,uint256)').functions.transferClaimant(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionIdentifier: string,
            _claimant: string,
            _nextPayment: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'transferClaimant(bytes32,address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdentifier,
        _claimant,
        _nextPayment
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier,
        _claimant,
        _nextPayment
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier,
        _claimant,
        _nextPayment
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.transferClaimant(
                _subscriptionIdentifier,
                _claimant,
                _nextPayment
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
            const outputAbi = (_.find(self.abi, {name: 'transferClaimant'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public cancelPayment = {
        async sendTransactionAsync(
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('cancelPayment(bytes32)').inputs;
            [_subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('cancelPayment(bytes32)').functions.cancelPayment(
                _subscriptionIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.cancelPayment.estimateGasAsync.bind(
                    self,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('cancelPayment(bytes32)').inputs;
            [_subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('cancelPayment(bytes32)').functions.cancelPayment(
                _subscriptionIdentifier
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
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('cancelPayment(bytes32)').inputs;
            [_subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('cancelPayment(bytes32)').functions.cancelPayment(
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'cancelPayment(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.cancelPayment(
                _subscriptionIdentifier
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
            const outputAbi = (_.find(self.abi, {name: 'cancelPayment'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public deletePayment = {
        async sendTransactionAsync(
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('deletePayment(bytes32)').inputs;
            [_subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('deletePayment(bytes32)').functions.deletePayment(
                _subscriptionIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.deletePayment.estimateGasAsync.bind(
                    self,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('deletePayment(bytes32)').inputs;
            [_subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('deletePayment(bytes32)').functions.deletePayment(
                _subscriptionIdentifier
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
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as PaymentRegistryContract;
            const inputAbi = self._lookupAbi('deletePayment(bytes32)').inputs;
            [_subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('deletePayment(bytes32)').functions.deletePayment(
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'deletePayment(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.deletePayment(
                _subscriptionIdentifier
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
            const outputAbi = (_.find(self.abi, {name: 'deletePayment'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public getPaymentInformation = {
        async callAsync(
            _subscriptionIdenitifer: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber, BigNumber]
        > {
            const self = this as any as PaymentRegistryContract;
            const functionSignature = 'getPaymentInformation(bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionIdenitifer
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionIdenitifer
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionIdenitifer
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getPaymentInformation(
                _subscriptionIdenitifer
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
            const outputAbi = (_.find(self.abi, {name: 'getPaymentInformation'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact,
        provider: Provider,
        txDefaults: Partial<TxData>,
    ): Promise<PaymentRegistryContract> {
        if (_.isUndefined(artifact.compilerOutput)) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return PaymentRegistryContract.deployAsync(bytecode, abi, provider, txDefaults, );
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        provider: Provider,
        txDefaults: Partial<TxData>,
    ): Promise<PaymentRegistryContract> {
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [],
            BaseContract._bigNumberToString,
        );
        const txData = ethers.Contract.getDeployTransaction(bytecode, abi, );
        const web3Wrapper = new Web3Wrapper(provider);
        const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
            txData,
            txDefaults,
            web3Wrapper.estimateGasAsync.bind(web3Wrapper),
        );
        const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
        logUtils.log(`transactionHash: ${txHash}`);
        const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
        logUtils.log(`PaymentRegistry successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new PaymentRegistryContract(abi, txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [];
        return contractInstance;
    }
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
        super('PaymentRegistry', abi, address, provider, txDefaults);
        classUtils.bindAll(this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
