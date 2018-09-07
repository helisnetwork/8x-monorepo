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

export type ExecutorEventArgs =
    | ExecutorSubscriptionActivatedEventArgs
    | ExecutorSubscriptionProcessedEventArgs
    | ExecutorSubscriptionReleasedEventArgs
    | ExecutorSubscriptionLatePaymentCaughtEventArgs
    | ExecutorSubscriptionCancelledEventArgs
    | ExecutorCheckpointEventArgs
    | ExecutorOwnershipTransferredEventArgs;

export enum ExecutorEvents {
    SubscriptionActivated = 'SubscriptionActivated',
    SubscriptionProcessed = 'SubscriptionProcessed',
    SubscriptionReleased = 'SubscriptionReleased',
    SubscriptionLatePaymentCaught = 'SubscriptionLatePaymentCaught',
    SubscriptionCancelled = 'SubscriptionCancelled',
    Checkpoint = 'Checkpoint',
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface ExecutorSubscriptionActivatedEventArgs extends DecodedLogArgs {
    subscriptionAddress: string;
    subscriptionIdentifier: string;
    tokenAddress: string;
    dueDate: BigNumber;
    amount: BigNumber;
    fee: BigNumber;
}

export interface ExecutorSubscriptionProcessedEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    claimant: string;
    dueDate: BigNumber;
    staked: BigNumber;
}

export interface ExecutorSubscriptionReleasedEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    releasedBy: string;
    dueDate: BigNumber;
}

export interface ExecutorSubscriptionLatePaymentCaughtEventArgs extends DecodedLogArgs {
    subscriptionIdentifier: string;
    originalClaimant: string;
    newClaimant: string;
    amountLost: BigNumber;
}

export interface ExecutorSubscriptionCancelledEventArgs extends DecodedLogArgs {
    subscriptionAddress: string;
    subscriptionIdentifier: string;
}

export interface ExecutorCheckpointEventArgs extends DecodedLogArgs {
    number: BigNumber;
}

export interface ExecutorOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class ExecutorContract extends BaseContract {
    public requirementsContract = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'requirementsContract()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.requirementsContract(
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
            const outputAbi = (_.find(self.abi, {name: 'requirementsContract'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public stakeContract = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'stakeContract()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.stakeContract(
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
            const outputAbi = (_.find(self.abi, {name: 'stakeContract'}) as MethodAbi).outputs;
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
            const self = this as any as ExecutorContract;
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
    public transferProxy = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'transferProxy()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.transferProxy(
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
            const outputAbi = (_.find(self.abi, {name: 'transferProxy'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public owner = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ExecutorContract;
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
    public lockUpPercentage = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'lockUpPercentage()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.lockUpPercentage(
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
            const outputAbi = (_.find(self.abi, {name: 'lockUpPercentage'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public paymentRegistry = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'paymentRegistry()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.paymentRegistry(
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
            const outputAbi = (_.find(self.abi, {name: 'paymentRegistry'}) as MethodAbi).outputs;
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
            const self = this as any as ExecutorContract;
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
            const self = this as any as ExecutorContract;
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
            const self = this as any as ExecutorContract;
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
            const self = this as any as ExecutorContract;
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
    public maximumIntervalDivisor = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'maximumIntervalDivisor()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.maximumIntervalDivisor(
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
            const outputAbi = (_.find(self.abi, {name: 'maximumIntervalDivisor'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public setPercentageLockUp = {
        async sendTransactionAsync(
            _percentage: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('setPercentageLockUp(uint256)').inputs;
            [_percentage
    ] = BaseContract._formatABIDataItemList(inputAbi, [_percentage
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_percentage
    ]);
            const encodedData = self._lookupEthersInterface('setPercentageLockUp(uint256)').functions.setPercentageLockUp(
                _percentage
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setPercentageLockUp.estimateGasAsync.bind(
                    self,
                    _percentage
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _percentage: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('setPercentageLockUp(uint256)').inputs;
            [_percentage
    ] = BaseContract._formatABIDataItemList(inputAbi, [_percentage
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setPercentageLockUp(uint256)').functions.setPercentageLockUp(
                _percentage
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
            _percentage: BigNumber,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('setPercentageLockUp(uint256)').inputs;
            [_percentage
    ] = BaseContract._formatABIDataItemList(inputAbi, [_percentage
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setPercentageLockUp(uint256)').functions.setPercentageLockUp(
                _percentage
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _percentage: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'setPercentageLockUp(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_percentage
        ] = BaseContract._formatABIDataItemList(inputAbi, [_percentage
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_percentage
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setPercentageLockUp(
                _percentage
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
            const outputAbi = (_.find(self.abi, {name: 'setPercentageLockUp'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setMaximumIntervalDivisor = {
        async sendTransactionAsync(
            _divisor: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('setMaximumIntervalDivisor(uint256)').inputs;
            [_divisor
    ] = BaseContract._formatABIDataItemList(inputAbi, [_divisor
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_divisor
    ]);
            const encodedData = self._lookupEthersInterface('setMaximumIntervalDivisor(uint256)').functions.setMaximumIntervalDivisor(
                _divisor
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setMaximumIntervalDivisor.estimateGasAsync.bind(
                    self,
                    _divisor
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _divisor: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('setMaximumIntervalDivisor(uint256)').inputs;
            [_divisor
    ] = BaseContract._formatABIDataItemList(inputAbi, [_divisor
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setMaximumIntervalDivisor(uint256)').functions.setMaximumIntervalDivisor(
                _divisor
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
            _divisor: BigNumber,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('setMaximumIntervalDivisor(uint256)').inputs;
            [_divisor
    ] = BaseContract._formatABIDataItemList(inputAbi, [_divisor
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setMaximumIntervalDivisor(uint256)').functions.setMaximumIntervalDivisor(
                _divisor
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _divisor: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'setMaximumIntervalDivisor(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_divisor
        ] = BaseContract._formatABIDataItemList(inputAbi, [_divisor
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_divisor
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setMaximumIntervalDivisor(
                _divisor
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
            const outputAbi = (_.find(self.abi, {name: 'setMaximumIntervalDivisor'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public activateSubscription = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('activateSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('activateSubscription(address,bytes32)').functions.activateSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.activateSubscription.estimateGasAsync.bind(
                    self,
                    _subscriptionContract,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('activateSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('activateSubscription(address,bytes32)').functions.activateSubscription(
                _subscriptionContract,
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
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('activateSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('activateSubscription(address,bytes32)').functions.activateSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'activateSubscription(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.activateSubscription(
                _subscriptionContract,
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
            const outputAbi = (_.find(self.abi, {name: 'activateSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public processSubscription = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('processSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('processSubscription(address,bytes32)').functions.processSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.processSubscription.estimateGasAsync.bind(
                    self,
                    _subscriptionContract,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('processSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('processSubscription(address,bytes32)').functions.processSubscription(
                _subscriptionContract,
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
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('processSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('processSubscription(address,bytes32)').functions.processSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'processSubscription(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.processSubscription(
                _subscriptionContract,
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
            const outputAbi = (_.find(self.abi, {name: 'processSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public releaseSubscription = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('releaseSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('releaseSubscription(address,bytes32)').functions.releaseSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.releaseSubscription.estimateGasAsync.bind(
                    self,
                    _subscriptionContract,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('releaseSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('releaseSubscription(address,bytes32)').functions.releaseSubscription(
                _subscriptionContract,
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
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('releaseSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('releaseSubscription(address,bytes32)').functions.releaseSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'releaseSubscription(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.releaseSubscription(
                _subscriptionContract,
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
            const outputAbi = (_.find(self.abi, {name: 'releaseSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public catchLateSubscription = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('catchLateSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('catchLateSubscription(address,bytes32)').functions.catchLateSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.catchLateSubscription.estimateGasAsync.bind(
                    self,
                    _subscriptionContract,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('catchLateSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('catchLateSubscription(address,bytes32)').functions.catchLateSubscription(
                _subscriptionContract,
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
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('catchLateSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('catchLateSubscription(address,bytes32)').functions.catchLateSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'catchLateSubscription(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.catchLateSubscription(
                _subscriptionContract,
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
            const outputAbi = (_.find(self.abi, {name: 'catchLateSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public cancelSubscription = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('cancelSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('cancelSubscription(address,bytes32)').functions.cancelSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
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
                    _subscriptionContract,
                    _subscriptionIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('cancelSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('cancelSubscription(address,bytes32)').functions.cancelSubscription(
                _subscriptionContract,
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
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('cancelSubscription(address,bytes32)').inputs;
            [_subscriptionContract,
    _subscriptionIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _subscriptionIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('cancelSubscription(address,bytes32)').functions.cancelSubscription(
                _subscriptionContract,
                _subscriptionIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'cancelSubscription(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.cancelSubscription(
                _subscriptionContract,
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
            const outputAbi = (_.find(self.abi, {name: 'cancelSubscription'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public determineStake = {
        async sendTransactionAsync(
            _tokenAddress: string,
            _startDate: BigNumber,
            _interval: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('determineStake(address,uint256,uint256)').inputs;
            [_tokenAddress,
    _startDate,
    _interval
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _startDate,
    _interval
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
    _startDate,
    _interval
    ]);
            const encodedData = self._lookupEthersInterface('determineStake(address,uint256,uint256)').functions.determineStake(
                _tokenAddress,
                _startDate,
                _interval
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.determineStake.estimateGasAsync.bind(
                    self,
                    _tokenAddress,
                    _startDate,
                    _interval
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            _startDate: BigNumber,
            _interval: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('determineStake(address,uint256,uint256)').inputs;
            [_tokenAddress,
    _startDate,
    _interval
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _startDate,
    _interval
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('determineStake(address,uint256,uint256)').functions.determineStake(
                _tokenAddress,
                _startDate,
                _interval
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
            _startDate: BigNumber,
            _interval: BigNumber,
        ): string {
            const self = this as any as ExecutorContract;
            const inputAbi = self._lookupAbi('determineStake(address,uint256,uint256)').inputs;
            [_tokenAddress,
    _startDate,
    _interval
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _startDate,
    _interval
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('determineStake(address,uint256,uint256)').functions.determineStake(
                _tokenAddress,
                _startDate,
                _interval
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            _startDate: BigNumber,
            _interval: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as ExecutorContract;
            const functionSignature = 'determineStake(address,uint256,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress,
        _startDate,
        _interval
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
        _startDate,
        _interval
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
        _startDate,
        _interval
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.determineStake(
                _tokenAddress,
                _startDate,
                _interval
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
            const outputAbi = (_.find(self.abi, {name: 'determineStake'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _transferProxyAddress: string,
            _stakeContractAddress: string,
            _paymentRegistryAddress: string,
            _approvedRegistryAddress: string,
            _requirementsAddress: string,
            _lockUpPercentage: BigNumber,
            _divisor: BigNumber,
    ): Promise<ExecutorContract> {
        if (_.isUndefined(artifact.compilerOutput)) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return ExecutorContract.deployAsync(bytecode, abi, provider, txDefaults, _transferProxyAddress,
_stakeContractAddress,
_paymentRegistryAddress,
_approvedRegistryAddress,
_requirementsAddress,
_lockUpPercentage,
_divisor
);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _transferProxyAddress: string,
            _stakeContractAddress: string,
            _paymentRegistryAddress: string,
            _approvedRegistryAddress: string,
            _requirementsAddress: string,
            _lockUpPercentage: BigNumber,
            _divisor: BigNumber,
    ): Promise<ExecutorContract> {
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [_transferProxyAddress,
_stakeContractAddress,
_paymentRegistryAddress,
_approvedRegistryAddress,
_requirementsAddress,
_lockUpPercentage,
_divisor
] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [_transferProxyAddress,
_stakeContractAddress,
_paymentRegistryAddress,
_approvedRegistryAddress,
_requirementsAddress,
_lockUpPercentage,
_divisor
],
            BaseContract._bigNumberToString,
        );
        const txData = ethers.Contract.getDeployTransaction(bytecode, abi, _transferProxyAddress,
_stakeContractAddress,
_paymentRegistryAddress,
_approvedRegistryAddress,
_requirementsAddress,
_lockUpPercentage,
_divisor
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
        logUtils.log(`Executor successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new ExecutorContract(abi, txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [_transferProxyAddress,
_stakeContractAddress,
_paymentRegistryAddress,
_approvedRegistryAddress,
_requirementsAddress,
_lockUpPercentage,
_divisor
];
        return contractInstance;
    }
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
        super('Executor', abi, address, provider, txDefaults);
        classUtils.bindAll(this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
