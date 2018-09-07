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


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class ActionProxyContract extends BaseContract {
    public newAddress = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _planIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ActionProxyContract;
            const inputAbi = self._lookupAbi('newAddress(address,bytes32)').inputs;
            [_subscriptionContract,
    _planIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _planIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _planIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('newAddress(address,bytes32)').functions.newAddress(
                _subscriptionContract,
                _planIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.newAddress.estimateGasAsync.bind(
                    self,
                    _subscriptionContract,
                    _planIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _planIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ActionProxyContract;
            const inputAbi = self._lookupAbi('newAddress(address,bytes32)').inputs;
            [_subscriptionContract,
    _planIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _planIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('newAddress(address,bytes32)').functions.newAddress(
                _subscriptionContract,
                _planIdentifier
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
            _planIdentifier: string,
        ): string {
            const self = this as any as ActionProxyContract;
            const inputAbi = self._lookupAbi('newAddress(address,bytes32)').inputs;
            [_subscriptionContract,
    _planIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _planIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('newAddress(address,bytes32)').functions.newAddress(
                _subscriptionContract,
                _planIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _planIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ActionProxyContract;
            const functionSignature = 'newAddress(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _planIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _planIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _planIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.newAddress(
                _subscriptionContract,
                _planIdentifier
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
            const outputAbi = (_.find(self.abi, {name: 'newAddress'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public existingAddress = {
        async sendTransactionAsync(
            _subscriptionContract: string,
            _planIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as ActionProxyContract;
            const inputAbi = self._lookupAbi('existingAddress(address,bytes32)').inputs;
            [_subscriptionContract,
    _planIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _planIdentifier
    ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
    _planIdentifier
    ]);
            const encodedData = self._lookupEthersInterface('existingAddress(address,bytes32)').functions.existingAddress(
                _subscriptionContract,
                _planIdentifier
            ).data;
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.existingAddress.estimateGasAsync.bind(
                    self,
                    _subscriptionContract,
                    _planIdentifier
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _subscriptionContract: string,
            _planIdentifier: string,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as ActionProxyContract;
            const inputAbi = self._lookupAbi('existingAddress(address,bytes32)').inputs;
            [_subscriptionContract,
    _planIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _planIdentifier
    ], BaseContract._bigNumberToString);
            const encodedData = self._lookupEthersInterface('existingAddress(address,bytes32)').functions.existingAddress(
                _subscriptionContract,
                _planIdentifier
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
            _planIdentifier: string,
        ): string {
            const self = this as any as ActionProxyContract;
            const inputAbi = self._lookupAbi('existingAddress(address,bytes32)').inputs;
            [_subscriptionContract,
    _planIdentifier
    ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
    _planIdentifier
    ], BaseContract._bigNumberToString);
            const abiEncodedTransactionData = self._lookupEthersInterface('existingAddress(address,bytes32)').functions.existingAddress(
                _subscriptionContract,
                _planIdentifier
            ).data;
            return abiEncodedTransactionData;
        },
        async callAsync(
            _subscriptionContract: string,
            _planIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string
        > {
            const self = this as any as ActionProxyContract;
            const functionSignature = 'existingAddress(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _planIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _planIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _planIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.existingAddress(
                _subscriptionContract,
                _planIdentifier
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
            const outputAbi = (_.find(self.abi, {name: 'existingAddress'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray[0];
        },
    };
    public returnState = {
        async callAsync(
            _subscriptionContract: string,
            _subscriptionIdentifier: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[number, BigNumber]
        > {
            const self = this as any as ActionProxyContract;
            const functionSignature = 'returnState(address,bytes32)';
            const inputAbi = self._lookupAbi(functionSignature).inputs;
            [_subscriptionContract,
        _subscriptionIdentifier
        ] = BaseContract._formatABIDataItemList(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ], BaseContract._bigNumberToString.bind(self));
            BaseContract.strictArgumentEncodingCheck(inputAbi, [_subscriptionContract,
        _subscriptionIdentifier
        ]);
            const ethersFunction = self._lookupEthersInterface(functionSignature).functions.returnState(
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
            const outputAbi = (_.find(self.abi, {name: 'returnState'}) as MethodAbi).outputs;
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._lowercaseAddress.bind(this));
            resultArray = BaseContract._formatABIDataItemList(outputAbi, resultArray, BaseContract._bnToBigNumber.bind(this));
            return resultArray;
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact,
        provider: Provider,
        txDefaults: Partial<TxData>,
    ): Promise<ActionProxyContract> {
        if (_.isUndefined(artifact.compilerOutput)) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return ActionProxyContract.deployAsync(bytecode, abi, provider, txDefaults, );
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        provider: Provider,
        txDefaults: Partial<TxData>,
    ): Promise<ActionProxyContract> {
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
        logUtils.log(`ActionProxy successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new ActionProxyContract(abi, txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [];
        return contractInstance;
    }
    constructor(abi: ContractAbi, address: string, provider: Provider, txDefaults?: Partial<TxData>) {
        super('ActionProxy', abi, address, provider, txDefaults);
        classUtils.bindAll(this, ['_ethersInterfacesByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
