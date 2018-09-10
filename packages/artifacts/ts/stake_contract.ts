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

export type StakeContractEventArgs =
    | StakeContractLockedEventArgs
    | StakeContractUnlockedEventArgs
    | StakeContractSlashedEventArgs
    | StakeContractTransferredEventArgs
    | StakeContractToppedUpEventArgs
    | StakeContractWithdrewEventArgs
    | StakeContractGiniCoefficientUpdatedEventArgs
    | StakeContractDivideTotalUpdatedEventArgs
    | StakeContractLogAuthorizedAddressAddedEventArgs
    | StakeContractLogAuthorizedAddressRemovedEventArgs
    | StakeContractOwnershipTransferredEventArgs;

export enum StakeContractEvents {
    Locked = 'Locked',
    Unlocked = 'Unlocked',
    Slashed = 'Slashed',
    Transferred = 'Transferred',
    ToppedUp = 'ToppedUp',
    Withdrew = 'Withdrew',
    GiniCoefficientUpdated = 'GiniCoefficientUpdated',
    DivideTotalUpdated = 'DivideTotalUpdated',
    LogAuthorizedAddressAdded = 'LogAuthorizedAddressAdded',
    LogAuthorizedAddressRemoved = 'LogAuthorizedAddressRemoved',
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface StakeContractLockedEventArgs extends DecodedLogArgs {
    staker: string;
    tokenAddress: string;
    amount: BigNumber;
}

export interface StakeContractUnlockedEventArgs extends DecodedLogArgs {
    staker: string;
    tokenAddress: string;
    amount: BigNumber;
}

export interface StakeContractSlashedEventArgs extends DecodedLogArgs {
    staker: string;
    tokenAddress: string;
    amount: BigNumber;
}

export interface StakeContractTransferredEventArgs extends DecodedLogArgs {
    staker: string;
    tokenAddress: string;
    amount: BigNumber;
    destination: string;
}

export interface StakeContractToppedUpEventArgs extends DecodedLogArgs {
    staker: string;
    tokenAddress: string;
    amount: BigNumber;
}

export interface StakeContractWithdrewEventArgs extends DecodedLogArgs {
    staker: string;
    tokenAddress: string;
    amount: BigNumber;
}

export interface StakeContractGiniCoefficientUpdatedEventArgs extends DecodedLogArgs {
    tokenAddress: string;
    gini: BigNumber;
}

export interface StakeContractDivideTotalUpdatedEventArgs extends DecodedLogArgs {
    tokenAddress: string;
    divideBy: BigNumber;
}

export interface StakeContractLogAuthorizedAddressAddedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}

export interface StakeContractLogAuthorizedAddressRemovedEventArgs extends DecodedLogArgs {
    target: string;
    caller: string;
}

export interface StakeContractOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class StakeContractContract extends BaseContract {
    public addAuthorizedAddress = {
        async sendTransactionAsync(
            _target: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
    public tokenContract = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'tokenContract()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.tokenContract(
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
            const outputAbi = (_.find(self.abi, {name: 'tokenContract'}) as MethodAbi).outputs;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
    public userStakes = {
        async callAsync(
            index_0: string,
            index_1: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'userStakes(address,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0,
        index_1
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0,
        index_1
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0,
        index_1
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.userStakes(
                index_0,
                index_1
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
            const outputAbi = (_.find(self.abi, {name: 'userStakes'}) as MethodAbi).outputs;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
            const self = this as any as StakeContractContract;
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
    public setGiniCoefficient = {
        async sendTransactionAsync(
            _tokenAddress: string,
            _gini: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('setGiniCoefficient(address,uint256)').inputs;
            [_tokenAddress,
    _gini
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _gini
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
    _gini
    ]);
            const encodedData = self._lookupEthersInterface('setGiniCoefficient(address,uint256)').functions.setGiniCoefficient(
                _tokenAddress,
                _gini
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setGiniCoefficient.estimateGasAsync.bind(
                    self,
                    _tokenAddress,
                    _gini
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            _gini: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('setGiniCoefficient(address,uint256)').inputs;
            [_tokenAddress,
    _gini
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _gini
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setGiniCoefficient(address,uint256)').functions.setGiniCoefficient(
                _tokenAddress,
                _gini
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
            _tokenAddress: string,
            _gini: BigNumber,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('setGiniCoefficient(address,uint256)').inputs;
            [_tokenAddress,
    _gini
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _gini
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setGiniCoefficient(address,uint256)').functions.setGiniCoefficient(
                _tokenAddress,
                _gini
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            _gini: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'setGiniCoefficient(address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress,
        _gini
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
        _gini
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
        _gini
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setGiniCoefficient(
                _tokenAddress,
                _gini
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
            const outputAbi = (_.find(self.abi, {name: 'setGiniCoefficient'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setDivideTotalBy = {
        async sendTransactionAsync(
            _tokenAddress: string,
            _divideBy: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('setDivideTotalBy(address,uint256)').inputs;
            [_tokenAddress,
    _divideBy
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _divideBy
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
    _divideBy
    ]);
            const encodedData = self._lookupEthersInterface('setDivideTotalBy(address,uint256)').functions.setDivideTotalBy(
                _tokenAddress,
                _divideBy
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setDivideTotalBy.estimateGasAsync.bind(
                    self,
                    _tokenAddress,
                    _divideBy
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            _divideBy: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('setDivideTotalBy(address,uint256)').inputs;
            [_tokenAddress,
    _divideBy
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _divideBy
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setDivideTotalBy(address,uint256)').functions.setDivideTotalBy(
                _tokenAddress,
                _divideBy
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
            _tokenAddress: string,
            _divideBy: BigNumber,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('setDivideTotalBy(address,uint256)').inputs;
            [_tokenAddress,
    _divideBy
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _divideBy
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setDivideTotalBy(address,uint256)').functions.setDivideTotalBy(
                _tokenAddress,
                _divideBy
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            _divideBy: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'setDivideTotalBy(address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress,
        _divideBy
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
        _divideBy
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
        _divideBy
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setDivideTotalBy(
                _tokenAddress,
                _divideBy
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
            const outputAbi = (_.find(self.abi, {name: 'setDivideTotalBy'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public lockTokens = {
        async sendTransactionAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('lockTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ]);
            const encodedData = self._lookupEthersInterface('lockTokens(address,address,uint256)').functions.lockTokens(
                _staker,
                _tokenAddress,
                _amount
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.lockTokens.estimateGasAsync.bind(
                    self,
                    _staker,
                    _tokenAddress,
                    _amount
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('lockTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('lockTokens(address,address,uint256)').functions.lockTokens(
                _staker,
                _tokenAddress,
                _amount
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
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('lockTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('lockTokens(address,address,uint256)').functions.lockTokens(
                _staker,
                _tokenAddress,
                _amount
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'lockTokens(address,address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress,
        _amount
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress,
        _amount
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress,
        _amount
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.lockTokens(
                _staker,
                _tokenAddress,
                _amount
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
            const outputAbi = (_.find(self.abi, {name: 'lockTokens'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public unlockTokens = {
        async sendTransactionAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('unlockTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ]);
            const encodedData = self._lookupEthersInterface('unlockTokens(address,address,uint256)').functions.unlockTokens(
                _staker,
                _tokenAddress,
                _amount
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.unlockTokens.estimateGasAsync.bind(
                    self,
                    _staker,
                    _tokenAddress,
                    _amount
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('unlockTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('unlockTokens(address,address,uint256)').functions.unlockTokens(
                _staker,
                _tokenAddress,
                _amount
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
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('unlockTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('unlockTokens(address,address,uint256)').functions.unlockTokens(
                _staker,
                _tokenAddress,
                _amount
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'unlockTokens(address,address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress,
        _amount
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress,
        _amount
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress,
        _amount
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.unlockTokens(
                _staker,
                _tokenAddress,
                _amount
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
            const outputAbi = (_.find(self.abi, {name: 'unlockTokens'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public slashTokens = {
        async sendTransactionAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('slashTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ]);
            const encodedData = self._lookupEthersInterface('slashTokens(address,address,uint256)').functions.slashTokens(
                _staker,
                _tokenAddress,
                _amount
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.slashTokens.estimateGasAsync.bind(
                    self,
                    _staker,
                    _tokenAddress,
                    _amount
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('slashTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('slashTokens(address,address,uint256)').functions.slashTokens(
                _staker,
                _tokenAddress,
                _amount
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
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('slashTokens(address,address,uint256)').inputs;
            [_staker,
    _tokenAddress,
    _amount
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('slashTokens(address,address,uint256)').functions.slashTokens(
                _staker,
                _tokenAddress,
                _amount
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'slashTokens(address,address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress,
        _amount
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress,
        _amount
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress,
        _amount
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.slashTokens(
                _staker,
                _tokenAddress,
                _amount
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
            const outputAbi = (_.find(self.abi, {name: 'slashTokens'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public transferStake = {
        async sendTransactionAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            _destination: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('transferStake(address,address,uint256,address)').inputs;
            [_staker,
    _tokenAddress,
    _amount,
    _destination
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount,
    _destination
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
    _tokenAddress,
    _amount,
    _destination
    ]);
            const encodedData = self._lookupEthersInterface('transferStake(address,address,uint256,address)').functions.transferStake(
                _staker,
                _tokenAddress,
                _amount,
                _destination
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.transferStake.estimateGasAsync.bind(
                    self,
                    _staker,
                    _tokenAddress,
                    _amount,
                    _destination
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            _destination: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('transferStake(address,address,uint256,address)').inputs;
            [_staker,
    _tokenAddress,
    _amount,
    _destination
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount,
    _destination
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('transferStake(address,address,uint256,address)').functions.transferStake(
                _staker,
                _tokenAddress,
                _amount,
                _destination
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
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            _destination: string,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('transferStake(address,address,uint256,address)').inputs;
            [_staker,
    _tokenAddress,
    _amount,
    _destination
    ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
    _tokenAddress,
    _amount,
    _destination
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('transferStake(address,address,uint256,address)').functions.transferStake(
                _staker,
                _tokenAddress,
                _amount,
                _destination
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            _amount: BigNumber,
            _destination: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'transferStake(address,address,uint256,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress,
        _amount,
        _destination
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress,
        _amount,
        _destination
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress,
        _amount,
        _destination
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.transferStake(
                _staker,
                _tokenAddress,
                _amount,
                _destination
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
            const outputAbi = (_.find(self.abi, {name: 'transferStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public getTotalStake = {
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getTotalStake(address,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getTotalStake(
                _staker,
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getTotalStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getAvailableStake = {
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getAvailableStake(address,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getAvailableStake(
                _staker,
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getAvailableStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getLockedStake = {
        async callAsync(
            _staker: string,
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getLockedStake(address,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_staker,
        _tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_staker,
        _tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_staker,
        _tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getLockedStake(
                _staker,
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getLockedStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getTotalTokenStake = {
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getTotalTokenStake(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getTotalTokenStake(
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getTotalTokenStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getAvailableTokenStake = {
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getAvailableTokenStake(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getAvailableTokenStake(
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getAvailableTokenStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getLockedTokenStake = {
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getLockedTokenStake(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getLockedTokenStake(
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getLockedTokenStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getTokenStakeDetails = {
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'getTokenStakeDetails(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getTokenStakeDetails(
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'getTokenStakeDetails'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public topUpStake = {
        async sendTransactionAsync(
            _amount: BigNumber,
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('topUpStake(uint256,address)').inputs;
            [_amount,
    _tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
    _tokenAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_amount,
    _tokenAddress
    ]);
            const encodedData = self._lookupEthersInterface('topUpStake(uint256,address)').functions.topUpStake(
                _amount,
                _tokenAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.topUpStake.estimateGasAsync.bind(
                    self,
                    _amount,
                    _tokenAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _amount: BigNumber,
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('topUpStake(uint256,address)').inputs;
            [_amount,
    _tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
    _tokenAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('topUpStake(uint256,address)').functions.topUpStake(
                _amount,
                _tokenAddress
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
            _amount: BigNumber,
            _tokenAddress: string,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('topUpStake(uint256,address)').inputs;
            [_amount,
    _tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
    _tokenAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('topUpStake(uint256,address)').functions.topUpStake(
                _amount,
                _tokenAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _amount: BigNumber,
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'topUpStake(uint256,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_amount,
        _tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
        _tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_amount,
        _tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.topUpStake(
                _amount,
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'topUpStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public withdrawStake = {
        async sendTransactionAsync(
            _amount: BigNumber,
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('withdrawStake(uint256,address)').inputs;
            [_amount,
    _tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
    _tokenAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_amount,
    _tokenAddress
    ]);
            const encodedData = self._lookupEthersInterface('withdrawStake(uint256,address)').functions.withdrawStake(
                _amount,
                _tokenAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.withdrawStake.estimateGasAsync.bind(
                    self,
                    _amount,
                    _tokenAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _amount: BigNumber,
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('withdrawStake(uint256,address)').inputs;
            [_amount,
    _tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
    _tokenAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('withdrawStake(uint256,address)').functions.withdrawStake(
                _amount,
                _tokenAddress
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
            _amount: BigNumber,
            _tokenAddress: string,
        ): string {
            const self = this as any as StakeContractContract;
            const inputAbi = self._lookupAbi('withdrawStake(uint256,address)').inputs;
            [_amount,
    _tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
    _tokenAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('withdrawStake(uint256,address)').functions.withdrawStake(
                _amount,
                _tokenAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _amount: BigNumber,
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as StakeContractContract;
            const functionSignature = 'withdrawStake(uint256,address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_amount,
        _tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_amount,
        _tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_amount,
        _tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.withdrawStake(
                _amount,
                _tokenAddress
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
            const outputAbi = (_.find(self.abi, {name: 'withdrawStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _tokenAddress: string,
    ): Promise<StakeContractContract> {
        if (_.isUndefined(artifact.compilerOutput)) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return StakeContractContract.deployAsync(bytecode, abi, provider, txDefaults, _tokenAddress
);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _tokenAddress: string,
    ): Promise<StakeContractContract> {
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [_tokenAddress
] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [_tokenAddress
],
            BaseContract._bigNumberToString,
        );
        const txData = ethers.Contract.getDeployTransaction(bytecode, abi, _tokenAddress
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
        logUtils.log(`StakeContract successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new StakeContractContract(abi, txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [_tokenAddress
];
        return contractInstance;
    }
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
        super('StakeContract', abi, address, provider, txDefaults);
        classUtils.bindAll(this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
