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

export type ApprovedRegistryEventArgs =
    | ApprovedRegistryContractAddedEventArgs
    | ApprovedRegistryContractRemovedEventArgs
    | ApprovedRegistryTokenAddedEventArgs
    | ApprovedRegistryTokenRemovedEventArgs
    | ApprovedRegistryContractGasCostSetEventArgs
    | ApprovedRegistryContractGasCostRemovedEventArgs
    | ApprovedRegistryOwnershipTransferredEventArgs;

export enum ApprovedRegistryEvents {
    ContractAdded = 'ContractAdded',
    ContractRemoved = 'ContractRemoved',
    TokenAdded = 'TokenAdded',
    TokenRemoved = 'TokenRemoved',
    ContractGasCostSet = 'ContractGasCostSet',
    ContractGasCostRemoved = 'ContractGasCostRemoved',
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface ApprovedRegistryContractAddedEventArgs extends DecodedLogArgs {
    target: string;
}

export interface ApprovedRegistryContractRemovedEventArgs extends DecodedLogArgs {
    target: string;
}

export interface ApprovedRegistryTokenAddedEventArgs extends DecodedLogArgs {
    target: string;
}

export interface ApprovedRegistryTokenRemovedEventArgs extends DecodedLogArgs {
    target: string;
}

export interface ApprovedRegistryContractGasCostSetEventArgs extends DecodedLogArgs {
    contractAddress: string;
    index: BigNumber;
}

export interface ApprovedRegistryContractGasCostRemovedEventArgs extends DecodedLogArgs {
    contractAddress: string;
    index: BigNumber;
}

export interface ApprovedRegistryOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class ApprovedRegistryContract extends BaseContract {
    public wrappedEther = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'wrappedEther()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.wrappedEther(
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
            const outputAbi = (_.find(self.abi, {name: 'wrappedEther'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public approvedContractArray = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'approvedContractArray(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.approvedContractArray(
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
            const outputAbi = (_.find(self.abi, {name: 'approvedContractArray'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public approvedTokenArray = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'approvedTokenArray(uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.approvedTokenArray(
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
            const outputAbi = (_.find(self.abi, {name: 'approvedTokenArray'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public approvedContractMapping = {
        async callAsync(
            index_0: string,
            index_1: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber]
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'approvedContractMapping(address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0,
        index_1
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0,
        index_1
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0,
        index_1
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.approvedContractMapping(
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
            const outputAbi = (_.find(self.abi, {name: 'approvedContractMapping'}) as MethodAbi).outputs;
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
            const self = this as any as ApprovedRegistryContract;
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
    public approvedTokenMapping = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'approvedTokenMapping(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [index_0
        ] = BaseContract._formatABIDataItemList(inputAbi, [index_0
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [index_0
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.approvedTokenMapping(
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
            const outputAbi = (_.find(self.abi, {name: 'approvedTokenMapping'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public kyberProxy = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'kyberProxy()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.kyberProxy(
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
            const outputAbi = (_.find(self.abi, {name: 'kyberProxy'}) as MethodAbi).outputs;
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
            const self = this as any as ApprovedRegistryContract;
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
            const self = this as any as ApprovedRegistryContract;
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
            const self = this as any as ApprovedRegistryContract;
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
            const self = this as any as ApprovedRegistryContract;
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
    public getGasCost = {
        async sendTransactionAsync(
            _tokenAddress: string,
            _contractAddress: string,
            _index: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('getGasCost(address,address,uint256)').inputs;
            [_tokenAddress,
    _contractAddress,
    _index
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _contractAddress,
    _index
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
    _contractAddress,
    _index
    ]);
            const encodedData = self._lookupEthersInterface('getGasCost(address,address,uint256)').functions.getGasCost(
                _tokenAddress,
                _contractAddress,
                _index
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.getGasCost.estimateGasAsync.bind(
                    self,
                    _tokenAddress,
                    _contractAddress,
                    _index
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            _contractAddress: string,
            _index: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('getGasCost(address,address,uint256)').inputs;
            [_tokenAddress,
    _contractAddress,
    _index
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _contractAddress,
    _index
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('getGasCost(address,address,uint256)').functions.getGasCost(
                _tokenAddress,
                _contractAddress,
                _index
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
            _contractAddress: string,
            _index: BigNumber,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('getGasCost(address,address,uint256)').inputs;
            [_tokenAddress,
    _contractAddress,
    _index
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _contractAddress,
    _index
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('getGasCost(address,address,uint256)').functions.getGasCost(
                _tokenAddress,
                _contractAddress,
                _index
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            _contractAddress: string,
            _index: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'getGasCost(address,address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress,
        _contractAddress,
        _index
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
        _contractAddress,
        _index
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
        _contractAddress,
        _index
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getGasCost(
                _tokenAddress,
                _contractAddress,
                _index
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
            const outputAbi = (_.find(self.abi, {name: 'getGasCost'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getRateFor = {
        async sendTransactionAsync(
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('getRateFor(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
    ]);
            const encodedData = self._lookupEthersInterface('getRateFor(address)').functions.getRateFor(
                _tokenAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.getRateFor.estimateGasAsync.bind(
                    self,
                    _tokenAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('getRateFor(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('getRateFor(address)').functions.getRateFor(
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
            _tokenAddress: string,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('getRateFor(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('getRateFor(address)').functions.getRateFor(
                _tokenAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'getRateFor(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getRateFor(
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
            const outputAbi = (_.find(self.abi, {name: 'getRateFor'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public addApprovedContract = {
        async sendTransactionAsync(
            _contractAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('addApprovedContract(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress
    ]);
            const encodedData = self._lookupEthersInterface('addApprovedContract(address)').functions.addApprovedContract(
                _contractAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.addApprovedContract.estimateGasAsync.bind(
                    self,
                    _contractAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _contractAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('addApprovedContract(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('addApprovedContract(address)').functions.addApprovedContract(
                _contractAddress
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
            _contractAddress: string,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('addApprovedContract(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('addApprovedContract(address)').functions.addApprovedContract(
                _contractAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _contractAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'addApprovedContract(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_contractAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.addApprovedContract(
                _contractAddress
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
            const outputAbi = (_.find(self.abi, {name: 'addApprovedContract'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public setApprovedContractCallCost = {
        async sendTransactionAsync(
            _contractAddress: string,
            _index: BigNumber,
            _callValue: BigNumber,
            _gasCost: BigNumber,
            _gasPrice: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)').inputs;
            [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ]);
            const encodedData = self._lookupEthersInterface('setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)').functions.setApprovedContractCallCost(
                _contractAddress,
                _index,
                _callValue,
                _gasCost,
                _gasPrice
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setApprovedContractCallCost.estimateGasAsync.bind(
                    self,
                    _contractAddress,
                    _index,
                    _callValue,
                    _gasCost,
                    _gasPrice
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _contractAddress: string,
            _index: BigNumber,
            _callValue: BigNumber,
            _gasCost: BigNumber,
            _gasPrice: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)').inputs;
            [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)').functions.setApprovedContractCallCost(
                _contractAddress,
                _index,
                _callValue,
                _gasCost,
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
            _contractAddress: string,
            _index: BigNumber,
            _callValue: BigNumber,
            _gasCost: BigNumber,
            _gasPrice: BigNumber,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)').inputs;
            [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
    _index,
    _callValue,
    _gasCost,
    _gasPrice
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)').functions.setApprovedContractCallCost(
                _contractAddress,
                _index,
                _callValue,
                _gasCost,
                _gasPrice
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _contractAddress: string,
            _index: BigNumber,
            _callValue: BigNumber,
            _gasCost: BigNumber,
            _gasPrice: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'setApprovedContractCallCost(address,uint256,uint256,uint256,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_contractAddress,
        _index,
        _callValue,
        _gasCost,
        _gasPrice
        ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
        _index,
        _callValue,
        _gasCost,
        _gasPrice
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress,
        _index,
        _callValue,
        _gasCost,
        _gasPrice
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.setApprovedContractCallCost(
                _contractAddress,
                _index,
                _callValue,
                _gasCost,
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
            const outputAbi = (_.find(self.abi, {name: 'setApprovedContractCallCost'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public addApprovedToken = {
        async sendTransactionAsync(
            _tokenAddress: string,
            _isWETH: boolean,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('addApprovedToken(address,bool)').inputs;
            [_tokenAddress,
    _isWETH
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _isWETH
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
    _isWETH
    ]);
            const encodedData = self._lookupEthersInterface('addApprovedToken(address,bool)').functions.addApprovedToken(
                _tokenAddress,
                _isWETH
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.addApprovedToken.estimateGasAsync.bind(
                    self,
                    _tokenAddress,
                    _isWETH
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            _isWETH: boolean,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('addApprovedToken(address,bool)').inputs;
            [_tokenAddress,
    _isWETH
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _isWETH
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('addApprovedToken(address,bool)').functions.addApprovedToken(
                _tokenAddress,
                _isWETH
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
            _isWETH: boolean,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('addApprovedToken(address,bool)').inputs;
            [_tokenAddress,
    _isWETH
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
    _isWETH
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('addApprovedToken(address,bool)').functions.addApprovedToken(
                _tokenAddress,
                _isWETH
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            _isWETH: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'addApprovedToken(address,bool)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress,
        _isWETH
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress,
        _isWETH
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress,
        _isWETH
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.addApprovedToken(
                _tokenAddress,
                _isWETH
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
            const outputAbi = (_.find(self.abi, {name: 'addApprovedToken'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public removeApprovedContract = {
        async sendTransactionAsync(
            _contractAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedContract(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress
    ]);
            const encodedData = self._lookupEthersInterface('removeApprovedContract(address)').functions.removeApprovedContract(
                _contractAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeApprovedContract.estimateGasAsync.bind(
                    self,
                    _contractAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _contractAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedContract(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('removeApprovedContract(address)').functions.removeApprovedContract(
                _contractAddress
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
            _contractAddress: string,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedContract(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('removeApprovedContract(address)').functions.removeApprovedContract(
                _contractAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _contractAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'removeApprovedContract(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_contractAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.removeApprovedContract(
                _contractAddress
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
            const outputAbi = (_.find(self.abi, {name: 'removeApprovedContract'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public removeApprovedContractCallCost = {
        async sendTransactionAsync(
            _contractAddress: string,
            _index: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedContractCallCost(address,uint256)').inputs;
            [_contractAddress,
    _index
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
    _index
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress,
    _index
    ]);
            const encodedData = self._lookupEthersInterface('removeApprovedContractCallCost(address,uint256)').functions.removeApprovedContractCallCost(
                _contractAddress,
                _index
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeApprovedContractCallCost.estimateGasAsync.bind(
                    self,
                    _contractAddress,
                    _index
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _contractAddress: string,
            _index: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedContractCallCost(address,uint256)').inputs;
            [_contractAddress,
    _index
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
    _index
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('removeApprovedContractCallCost(address,uint256)').functions.removeApprovedContractCallCost(
                _contractAddress,
                _index
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
            _contractAddress: string,
            _index: BigNumber,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedContractCallCost(address,uint256)').inputs;
            [_contractAddress,
    _index
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
    _index
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('removeApprovedContractCallCost(address,uint256)').functions.removeApprovedContractCallCost(
                _contractAddress,
                _index
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _contractAddress: string,
            _index: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'removeApprovedContractCallCost(address,uint256)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_contractAddress,
        _index
        ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress,
        _index
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress,
        _index
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.removeApprovedContractCallCost(
                _contractAddress,
                _index
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
            const outputAbi = (_.find(self.abi, {name: 'removeApprovedContractCallCost'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public removeApprovedToken = {
        async sendTransactionAsync(
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedToken(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
    ]);
            const encodedData = self._lookupEthersInterface('removeApprovedToken(address)').functions.removeApprovedToken(
                _tokenAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeApprovedToken.estimateGasAsync.bind(
                    self,
                    _tokenAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedToken(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('removeApprovedToken(address)').functions.removeApprovedToken(
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
            _tokenAddress: string,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('removeApprovedToken(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('removeApprovedToken(address)').functions.removeApprovedToken(
                _tokenAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'removeApprovedToken(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.removeApprovedToken(
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
            const outputAbi = (_.find(self.abi, {name: 'removeApprovedToken'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public getApprovedContracts = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string[]
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'getApprovedContracts()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getApprovedContracts(
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
            const outputAbi = (_.find(self.abi, {name: 'getApprovedContracts'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public getApprovedTokens = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string[]
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'getApprovedTokens()';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [] = BaseContract._formatABIDataItemList(inputAbi, [], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, []);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.getApprovedTokens(
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
            const outputAbi = (_.find(self.abi, {name: 'getApprovedTokens'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public isContractAuthorised = {
        async sendTransactionAsync(
            _contractAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('isContractAuthorised(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress
    ]);
            const encodedData = self._lookupEthersInterface('isContractAuthorised(address)').functions.isContractAuthorised(
                _contractAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.isContractAuthorised.estimateGasAsync.bind(
                    self,
                    _contractAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _contractAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('isContractAuthorised(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('isContractAuthorised(address)').functions.isContractAuthorised(
                _contractAddress
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
            _contractAddress: string,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('isContractAuthorised(address)').inputs;
            [_contractAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('isContractAuthorised(address)').functions.isContractAuthorised(
                _contractAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _contractAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'isContractAuthorised(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_contractAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_contractAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_contractAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.isContractAuthorised(
                _contractAddress
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
            const outputAbi = (_.find(self.abi, {name: 'isContractAuthorised'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public isTokenAuthorised = {
        async sendTransactionAsync(
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('isTokenAuthorised(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
    ]);
            const encodedData = self._lookupEthersInterface('isTokenAuthorised(address)').functions.isTokenAuthorised(
                _tokenAddress
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.isTokenAuthorised.estimateGasAsync.bind(
                    self,
                    _tokenAddress
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _tokenAddress: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('isTokenAuthorised(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('isTokenAuthorised(address)').functions.isTokenAuthorised(
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
            _tokenAddress: string,
        ): string {
            const self = this as any as ApprovedRegistryContract;
            const inputAbi = self._lookupAbi('isTokenAuthorised(address)').inputs;
            [_tokenAddress
    ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('isTokenAuthorised(address)').functions.isTokenAuthorised(
                _tokenAddress
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean
        > {
            const self = this as any as ApprovedRegistryContract;
            const functionSignature = 'isTokenAuthorised(address)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_tokenAddress
        ] = BaseContract._formatABIDataItemList(inputAbi, [_tokenAddress
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_tokenAddress
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.isTokenAuthorised(
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
            const outputAbi = (_.find(self.abi, {name: 'isTokenAuthorised'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _kyberAddress: string,
    ): Promise<ApprovedRegistryContract> {
        if (_.isUndefined(artifact.compilerOutput)) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return ApprovedRegistryContract.deployAsync(bytecode, abi, provider, txDefaults, _kyberAddress
);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        provider: Provider,
        txDefaults: Partial<TxData>,
            _kyberAddress: string,
    ): Promise<ApprovedRegistryContract> {
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [_kyberAddress
] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [_kyberAddress
],
            BaseContract._bigNumberToString,
        );
        const txData = ethers.Contract.getDeployTransaction(bytecode, abi, _kyberAddress
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
        logUtils.log(`ApprovedRegistry successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new ApprovedRegistryContract(abi, txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [_kyberAddress
];
        return contractInstance;
    }
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
        super('ApprovedRegistry', abi, address, provider, txDefaults);
        classUtils.bindAll(this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
