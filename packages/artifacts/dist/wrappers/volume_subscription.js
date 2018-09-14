'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
* This file is auto-generated using abi-gen. Don't edit directly.
* Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
*/
var utils_1 = require("@0xproject/utils");
var VolumeSubscription_1 = require("../abi/ts/VolumeSubscription");
var base_contract_1 = require("@8xprotocol/base_contract");
var types_1 = require("@8xprotocol/types");
var Web3Utils_1 = require("../utils/Web3Utils");
var VolumeSubscriptionContract = /** @class */ (function (_super) {
    __extends(VolumeSubscriptionContract, _super);
    function VolumeSubscriptionContract(web3ContractInstance, defaults) {
        var _this = _super.call(this, web3ContractInstance, defaults) || this;
        _this.gasCost = {
            callAsync: function (defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.gasCost.call, self.web3ContractInstance)()];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.addAuthorizedAddress = {
            sendTransactionAsync: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.addAuthorizedAddress.estimateGasAsync.bind(self, _target))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.addAuthorizedAddress, self.web3ContractInstance)(_target, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.addAuthorizedAddress.estimateGas, self.web3ContractInstance)(_target, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.addAuthorizedAddress.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.addAuthorizedAddress.call, self.web3ContractInstance)(_target, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.authorities = {
            callAsync: function (index_0, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.authorities.call, self.web3ContractInstance)(index_0)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.approvedRegistry = {
            callAsync: function (defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.approvedRegistry.call, self.web3ContractInstance)()];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.removeAuthorizedAddress = {
            sendTransactionAsync: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.removeAuthorizedAddress.estimateGasAsync.bind(self, _target))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.removeAuthorizedAddress, self.web3ContractInstance)(_target, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.removeAuthorizedAddress.estimateGas, self.web3ContractInstance)(_target, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.removeAuthorizedAddress.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_target, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.removeAuthorizedAddress.call, self.web3ContractInstance)(_target, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.owner = {
            callAsync: function (defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.owner.call, self.web3ContractInstance)()];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.subscriptions = {
            callAsync: function (index_0, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.subscriptions.call, self.web3ContractInstance)(index_0)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.plans = {
            callAsync: function (index_0, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.plans.call, self.web3ContractInstance)(index_0)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.authorized = {
            callAsync: function (index_0, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.authorized.call, self.web3ContractInstance)(index_0)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getAuthorizedAddresses = {
            callAsync: function (defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getAuthorizedAddresses.call, self.web3ContractInstance)()];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.transferOwnership = {
            sendTransactionAsync: function (_newOwner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.transferOwnership.estimateGasAsync.bind(self, _newOwner))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.transferOwnership, self.web3ContractInstance)(_newOwner, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_newOwner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.transferOwnership.estimateGas, self.web3ContractInstance)(_newOwner, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_newOwner, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.transferOwnership.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_newOwner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.transferOwnership.call, self.web3ContractInstance)(_newOwner, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.gasPrice = {
            callAsync: function (defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.gasPrice.call, self.web3ContractInstance)()];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.terminatePlan = {
            sendTransactionAsync: function (_plan, _terminationDate, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.terminatePlan.estimateGasAsync.bind(self, _plan, _terminationDate))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.terminatePlan, self.web3ContractInstance)(_plan, _terminationDate, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_plan, _terminationDate, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.terminatePlan.estimateGas, self.web3ContractInstance)(_plan, _terminationDate, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_plan, _terminationDate, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.terminatePlan.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_plan, _terminationDate, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.terminatePlan.call, self.web3ContractInstance)(_plan, _terminationDate, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.isValidSubscription = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.isValidSubscription.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getSubscriptionTokenAddress = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getSubscriptionTokenAddress.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getSubscriptionFromToAddresses = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getSubscriptionFromToAddresses.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getSubscriptionInterval = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getSubscriptionInterval.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getAmountDueFromSubscription = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getAmountDueFromSubscription.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getSubscriptionFee = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getSubscriptionFee.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getLastSubscriptionPaymentDate = {
            callAsync: function (_subscription, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getLastSubscriptionPaymentDate.call, self.web3ContractInstance)(_subscription)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.getGasForExecution = {
            callAsync: function (_subscription, _type, defaultBlock) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.getGasForExecution.call, self.web3ContractInstance)(_subscription, _type)];
                            case 1:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.setLastPaymentDate = {
            sendTransactionAsync: function (_date, _subscription, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.setLastPaymentDate.estimateGasAsync.bind(self, _date, _subscription))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setLastPaymentDate, self.web3ContractInstance)(_date, _subscription, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_date, _subscription, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setLastPaymentDate.estimateGas, self.web3ContractInstance)(_date, _subscription, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_date, _subscription, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.setLastPaymentDate.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_date, _subscription, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setLastPaymentDate.call, self.web3ContractInstance)(_date, _subscription, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.cancelSubscription = {
            sendTransactionAsync: function (_subscription, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.cancelSubscription.estimateGasAsync.bind(self, _subscription))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.cancelSubscription, self.web3ContractInstance)(_subscription, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_subscription, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.cancelSubscription.estimateGas, self.web3ContractInstance)(_subscription, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_subscription, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.cancelSubscription.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_subscription, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.cancelSubscription.call, self.web3ContractInstance)(_subscription, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.setGasPrice = {
            sendTransactionAsync: function (_gasPrice, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.setGasPrice.estimateGasAsync.bind(self, _gasPrice))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setGasPrice, self.web3ContractInstance)(_gasPrice, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_gasPrice, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setGasPrice.estimateGas, self.web3ContractInstance)(_gasPrice, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_gasPrice, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.setGasPrice.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_gasPrice, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setGasPrice.call, self.web3ContractInstance)(_gasPrice, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.setGasCost = {
            sendTransactionAsync: function (_gasCost, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.setGasCost.estimateGasAsync.bind(self, _gasCost))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setGasCost, self.web3ContractInstance)(_gasCost, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_gasCost, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setGasCost.estimateGas, self.web3ContractInstance)(_gasCost, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_gasCost, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.setGasCost.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_gasCost, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setGasCost.call, self.web3ContractInstance)(_gasCost, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.createPlan = {
            sendTransactionAsync: function (_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.createPlan.estimateGasAsync.bind(self, _owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.createPlan, self.web3ContractInstance)(_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.createPlan.estimateGas, self.web3ContractInstance)(_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.createPlan.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.createPlan.call, self.web3ContractInstance)(_owner, _tokenAddress, _identifier, _interval, _amount, _fee, _data, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.createSubscription = {
            sendTransactionAsync: function (_planHash, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.createSubscription.estimateGasAsync.bind(self, _planHash, _data))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.createSubscription, self.web3ContractInstance)(_planHash, _data, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_planHash, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.createSubscription.estimateGas, self.web3ContractInstance)(_planHash, _data, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_planHash, _data, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.createSubscription.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_planHash, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.createSubscription.call, self.web3ContractInstance)(_planHash, _data, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.setPlanOwner = {
            sendTransactionAsync: function (_plan, _owner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.setPlanOwner.estimateGasAsync.bind(self, _plan, _owner))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setPlanOwner, self.web3ContractInstance)(_plan, _owner, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_plan, _owner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setPlanOwner.estimateGas, self.web3ContractInstance)(_plan, _owner, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_plan, _owner, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.setPlanOwner.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_plan, _owner, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setPlanOwner.call, self.web3ContractInstance)(_plan, _owner, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.setPlanData = {
            sendTransactionAsync: function (_plan, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.setPlanData.estimateGasAsync.bind(self, _plan, _data))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setPlanData, self.web3ContractInstance)(_plan, _data, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_plan, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setPlanData.estimateGas, self.web3ContractInstance)(_plan, _data, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_plan, _data, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.setPlanData.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_plan, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setPlanData.call, self.web3ContractInstance)(_plan, _data, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        _this.setSubscriptionData = {
            sendTransactionAsync: function (_subscription, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, txHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData, self.setSubscriptionData.estimateGasAsync.bind(self, _subscription, _data))];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setSubscriptionData, self.web3ContractInstance)(_subscription, _data, txDataWithDefaults)];
                            case 2:
                                txHash = _a.sent();
                                return [2 /*return*/, txHash];
                        }
                    });
                });
            },
            estimateGasAsync: function (_subscription, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, gas;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setSubscriptionData.estimateGas, self.web3ContractInstance)(_subscription, _data, txDataWithDefaults)];
                            case 2:
                                gas = _a.sent();
                                return [2 /*return*/, gas];
                        }
                    });
                });
            },
            getABIEncodedTransactionData: function (_subscription, _data, txData) {
                if (txData === void 0) { txData = {}; }
                var self = this;
                var abiEncodedTransactionData = self.web3ContractInstance.setSubscriptionData.getData();
                return abiEncodedTransactionData;
            },
            callAsync: function (_subscription, _data, txData) {
                if (txData === void 0) { txData = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var self, txDataWithDefaults, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                self = this;
                                return [4 /*yield*/, self.applyDefaultsToTxDataAsync(txData)];
                            case 1:
                                txDataWithDefaults = _a.sent();
                                return [4 /*yield*/, utils_1.promisify(self.web3ContractInstance.setSubscriptionData.call, self.web3ContractInstance)(_subscription, _data, txDataWithDefaults)];
                            case 2:
                                result = _a.sent();
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
        types_1.classUtils.bindAll(_this, ['web3ContractInstance', 'defaults']);
        return _this;
    }
    VolumeSubscriptionContract.prototype.deploy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var wrapper;
            return __generator(this, function (_a) {
                wrapper = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        wrapper.web3ContractInstance.new(wrapper.defaults, function (err, contract) {
                            if (err) {
                                reject(err);
                            }
                            else if (contract.address) {
                                wrapper.web3ContractInstance = wrapper.web3ContractInstance.at(contract.address);
                                wrapper.address = contract.address;
                                resolve();
                            }
                        });
                    })];
            });
        });
    };
    VolumeSubscriptionContract.deployed = function (web3, defaults) {
        return __awaiter(this, void 0, void 0, function () {
            var currentNetwork, abi, networks, web3ContractInstance;
            return __generator(this, function (_a) {
                currentNetwork = web3.version.network;
                abi = VolumeSubscription_1.VolumeSubscription.abi, networks = VolumeSubscription_1.VolumeSubscription.networks;
                web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);
                return [2 /*return*/, new VolumeSubscriptionContract(web3ContractInstance, defaults)];
            });
        });
    };
    VolumeSubscriptionContract.at = function (address, web3, defaults) {
        return __awaiter(this, void 0, void 0, function () {
            var abi, web3Utils, contractExists, currentNetwork, web3ContractInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abi = VolumeSubscription_1.VolumeSubscription.abi;
                        web3Utils = new Web3Utils_1.Web3Utils(web3);
                        return [4 /*yield*/, web3Utils.doesContractExistAtAddressAsync(address)];
                    case 1:
                        contractExists = _a.sent();
                        return [4 /*yield*/, web3Utils.getNetworkIdAsync()];
                    case 2:
                        currentNetwork = _a.sent();
                        if (contractExists) {
                            web3ContractInstance = web3.eth.contract(abi).at(address);
                            return [2 /*return*/, new VolumeSubscriptionContract(web3ContractInstance, defaults)];
                        }
                        else {
                            throw new Error(base_contract_1.CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('VolumeSubscription', currentNetwork));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return VolumeSubscriptionContract;
}(base_contract_1.BaseContract)); // tslint:disable:max-file-line-count
exports.VolumeSubscriptionContract = VolumeSubscriptionContract;
//# sourceMappingURL=volume_subscription.js.map