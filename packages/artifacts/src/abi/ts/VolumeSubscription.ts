export const VolumeSubscription = 
{
  "contractName": "VolumeSubscription",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "gasCost",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_target",
          "type": "address"
        }
      ],
      "name": "addAuthorizedAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "authorities",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "approvedRegistry",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_target",
          "type": "address"
        }
      ],
      "name": "removeAuthorizedAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "subscriptions",
      "outputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "name": "planHash",
          "type": "bytes32"
        },
        {
          "name": "lastPaymentDate",
          "type": "uint256"
        },
        {
          "name": "terminationDate",
          "type": "uint256"
        },
        {
          "name": "data",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "plans",
      "outputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "name": "identifier",
          "type": "bytes32"
        },
        {
          "name": "interval",
          "type": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "fee",
          "type": "uint256"
        },
        {
          "name": "data",
          "type": "string"
        },
        {
          "name": "terminationDate",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "authorized",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAuthorizedAddresses",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "gasPrice",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_approvedRegistryAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "businessIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "CreatedPlan",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "businessIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "UpdatedPlan",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "businessIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "terminationDate",
          "type": "uint256"
        }
      ],
      "name": "TerminatedPlan",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "CreatedSubscription",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "date",
          "type": "uint256"
        }
      ],
      "name": "LastSubscriptionPaymentDate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "UpdatedSubscription",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "planIdentifier",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "terminationDate",
          "type": "uint256"
        }
      ],
      "name": "TerminatedSubscription",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "target",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "LogAuthorizedAddressAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "target",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "LogAuthorizedAddressRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_plan",
          "type": "bytes32"
        },
        {
          "name": "_terminationDate",
          "type": "uint256"
        }
      ],
      "name": "terminatePlan",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "isValidSubscription",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "getSubscriptionTokenAddress",
      "outputs": [
        {
          "name": "subscriptionTokenAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "getSubscriptionFromToAddresses",
      "outputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "getSubscriptionInterval",
      "outputs": [
        {
          "name": "interval",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "getAmountDueFromSubscription",
      "outputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "getSubscriptionFee",
      "outputs": [
        {
          "name": "fee",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "getLastSubscriptionPaymentDate",
      "outputs": [
        {
          "name": "date",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        },
        {
          "name": "_type",
          "type": "uint256"
        }
      ],
      "name": "getGasForExecution",
      "outputs": [
        {
          "name": "returnedGasCost",
          "type": "uint256"
        },
        {
          "name": "returnedGasPrice",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_date",
          "type": "uint256"
        },
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "setLastPaymentDate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        }
      ],
      "name": "cancelSubscription",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_gasPrice",
          "type": "uint256"
        }
      ],
      "name": "setGasPrice",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_gasCost",
          "type": "uint256"
        }
      ],
      "name": "setGasCost",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "name": "_identifier",
          "type": "bytes32"
        },
        {
          "name": "_interval",
          "type": "uint256"
        },
        {
          "name": "_amount",
          "type": "uint256"
        },
        {
          "name": "_fee",
          "type": "uint256"
        },
        {
          "name": "_data",
          "type": "string"
        }
      ],
      "name": "createPlan",
      "outputs": [
        {
          "name": "newPlanHash",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_planHash",
          "type": "bytes32"
        },
        {
          "name": "_data",
          "type": "string"
        }
      ],
      "name": "createSubscription",
      "outputs": [
        {
          "name": "newSubscriptionHash",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_plan",
          "type": "bytes32"
        },
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "setPlanOwner",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_plan",
          "type": "bytes32"
        },
        {
          "name": "_data",
          "type": "string"
        }
      ],
      "name": "setPlanData",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscription",
          "type": "bytes32"
        },
        {
          "name": "_data",
          "type": "string"
        }
      ],
      "name": "setSubscriptionData",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x6080604052637735940060065562030d4060075534801561001f57600080fd5b50604051602080612fc083398101806040528101908080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050612eed806100d36000396000f300608060405260043610610180576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063064d00111461018557806312fa3b64146102765780631d5e3fe5146102e75780631fe15f33146103125780633b5bd8a21461038957806342f1181e146103ce578063494503d4146104115780635503b6f41461047e57806361fdaee7146104d5578063649bd05b1461056857806366fc8c5c146105df578063707129391461063057806379f9f6a1146106735780638aba4659146106b85780638d0b40c0146106e55780638da5cb5b1461072a57806394259c6c14610781578063aa4f2653146108ae578063b9181611146109e9578063bce3cf8b14610a44578063bf1fe42014610a89578063d21f1ffc14610ab6578063d39de6e914610ae7578063dbe3e15714610b53578063dd8d11e214610ba9578063e848bb8014610bf2578063ec1bc8a814610c96578063f2fde38b14610cd1578063fe173b9714610d14578063fead075c14610d3f575b600080fd5b34801561019157600080fd5b50610258600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600019169060200190929190803590602001909291908035906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610d7a565b60405180826000191660001916815260200191505060405180910390f35b34801561028257600080fd5b506102a560048036038101908080356000191690602001909291905050506112d1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156102f357600080fd5b506102fc611319565b6040518082815260200191505060405180910390f35b34801561031e57600080fd5b506103876004803603810190808035600019169060200190929190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061131f565b005b34801561039557600080fd5b506103b8600480360381019080803560001916906020019092919050505061147b565b6040518082815260200191505060405180910390f35b3480156103da57600080fd5b5061040f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506114c6565b005b34801561041d57600080fd5b5061043c60048036038101908080359060200190929190505050611696565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561048a57600080fd5b506104936116d4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104e157600080fd5b5061054a6004803603810190808035600019169060200190929190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506116fa565b60405180826000191660001916815260200191505060405180910390f35b34801561057457600080fd5b506105dd6004803603810190808035600019169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611a7e565b005b3480156105eb57600080fd5b5061062e6004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611bda565b005b34801561063c57600080fd5b50610671600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611d97565b005b34801561067f57600080fd5b506106a2600480360381019080803560001916906020019092919050505061203e565b6040518082815260200191505060405180910390f35b3480156106c457600080fd5b506106e360048036038101908080359060200190929190505050612066565b005b3480156106f157600080fd5b5061071460048036038101908080356000191690602001909291905050506120cb565b6040518082815260200191505060405180910390f35b34801561073657600080fd5b5061073f612116565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561078d57600080fd5b506107b0600480360381019080803560001916906020019092919050505061213b565b604051808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001856000191660001916815260200184815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561086e578082015181840152602081019050610853565b50505050905090810190601f16801561089b5780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b3480156108ba57600080fd5b506108dd600480360381019080803560001916906020019092919050505061224f565b604051808973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001876000191660001916815260200186815260200185815260200184815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156109a757808201518184015260208101905061098c565b50505050905090810190601f1680156109d45780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390f35b3480156109f557600080fd5b50610a2a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061236f565b604051808215151515815260200191505060405180910390f35b348015610a5057600080fd5b50610a73600480360381019080803560001916906020019092919050505061238f565b6040518082815260200191505060405180910390f35b348015610a9557600080fd5b50610ab4600480360381019080803590602001909291905050506123da565b005b348015610ac257600080fd5b50610ae5600480360381019080803560001916906020019092919050505061243f565b005b348015610af357600080fd5b50610afc61264e565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610b3f578082015181840152602081019050610b24565b505050509050019250505060405180910390f35b348015610b5f57600080fd5b50610b8c6004803603810190808035600019169060200190929190803590602001909291905050506126dc565b604051808381526020018281526020019250505060405180910390f35b348015610bb557600080fd5b50610bd860048036038101908080356000191690602001909291905050506126f0565b604051808215151515815260200191505060405180910390f35b348015610bfe57600080fd5b50610c21600480360381019080803560001916906020019092919050505061278c565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b348015610ca257600080fd5b50610ccf60048036038101908080359060200190929190803560001916906020019092919050505061283a565b005b348015610cdd57600080fd5b50610d12600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061299a565b005b348015610d2057600080fd5b50610d29612aef565b6040518082815260200191505060405180910390f35b348015610d4b57600080fd5b50610d78600480360381019080803560001916906020019092919080359060200190929190505050612af5565b005b600080610d85612c95565b60008a73ffffffffffffffffffffffffffffffffffffffff1614151515610dab57600080fd5b60008973ffffffffffffffffffffffffffffffffffffffff1614151515610dd157600080fd5b6000602060ff16111515610de457600080fd5b600087111515610df357600080fd5b600086111515610e0257600080fd5b8486111515610e1057600080fd5b600085111515610e1f57600080fd5b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663565eec488a6040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b158015610edc57600080fd5b505af1158015610ef0573d6000803e3d6000fd5b505050506040513d6020811015610f0657600080fd5b81019080805190602001909291905050501515610f2257600080fd5b89898989898989604051602001808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401866000191660001916815260200185815260200184815260200183815260200182805190602001908083835b6020831015156110035780518252602082019150602081019050602083039250610fde565b6001836020036101000a0380198251168184511680821785525050505050509050019750505050505050506040516020818303038152906040526040518082805190602001908083835b602083101515611072578051825260208201915060208101905060208303925061104d565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209150600060046000846000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561110457600080fd5b610100604051908101604052808b73ffffffffffffffffffffffffffffffffffffffff1681526020018a73ffffffffffffffffffffffffffffffffffffffff16815260200189600019168152602001888152602001878152602001868152602001858152602001600081525090508060046000846000191660001916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020190600019169055606082015181600301556080820151816004015560a0820151816005015560c0820151816006019080519060200190611266929190612d0a565b5060e082015181600701559050508973ffffffffffffffffffffffffffffffffffffffff16886000191683600019167f79c2b84e756968405d9e487643eac616f6a78e49734e99a87f8cb9f19f31e18c60405160405180910390a48192505050979650505050505050565b600060056000836000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60075481565b8160056000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561139857600080fd5b828260056000866000191660001916815260200190815260200160002060050190805190602001906113cb929190612d8a565b5060056000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600560008360001916600019168152602001908152602001600020600201546000191682600019167f888748bd68eba10d3d4e433485d3fcb8bcf8143298e46672b1b6e932629f7d0360405160405180910390a450505050565b60008060056000846000191660001916815260200190815260200160002060020154905060046000826000191660001916815260200190815260200160002060030154915050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561152157600080fd5b80600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151561157b57600080fd5b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060028290806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550503373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f94bb87f4c15c4587ff559a7584006fa01ddf9299359be6b512b94527aa961aca60405160405180910390a35050565b6002818154811015156116a557fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000611707612e0a565b60003373ffffffffffffffffffffffffffffffffffffffff161415151561172d57600080fd5b60046000876000191660001916815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1692503386611778612c8d565b604051602001808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c01000000000000000000000000028152601401836000191660001916815260200182815260200193505050506040516020818303038152906040526040518082805190602001908083835b60208310151561181d57805182526020820191506020810190506020830392506117f8565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209150600060056000846000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156118af57600080fd5b60008373ffffffffffffffffffffffffffffffffffffffff16141515156118d557600080fd5b60c0604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1681526020018760001916815260200160008152602001600081526020018681525090508060056000846000191660001916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020190600019169055606082015181600301556080820151816004015560a0820151816005019080519060200190611a21929190612d0a565b509050503373ffffffffffffffffffffffffffffffffffffffff16866000191683600019167f6abfbd7b7c579ffca1fe30e065456bc3e3f5f32e4c9e0edc74c1542c04f037b960405160405180910390a481935050505092915050565b8160046000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611af757600080fd5b82826004600086600019166000191681526020019081526020016000206006019080519060200190611b2a929190612d8a565b5060046000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600460008360001916600019168152602001908152602001600020600201546000191682600019167fa92e222390c2222aeb0b835e70ed6e71271d42cabf56eb644f902a193716200660405160405180910390a450505050565b8160046000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611c5357600080fd5b82600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141515611ce8578260046000866000191660001916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b60046000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600460008360001916600019168152602001908152602001600020600201546000191682600019167fa92e222390c2222aeb0b835e70ed6e71271d42cabf56eb644f902a193716200660405160405180910390a450505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611df457600080fd5b81600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515611e4d57600080fd5b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549060ff0219169055600091505b600280549050821015611fdf578273ffffffffffffffffffffffffffffffffffffffff16600283815481101515611ed457fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611fd2576002600160028054905003815481101515611f3257fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600283815481101515611f6c57fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600281818054905003915081611fcc9190612e70565b50611fdf565b8180600101925050611ea1565b3373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167ff5b347a1e40749dd050f5f07fbdbeb7e3efa9756903044dd29401fd1d4bb4a1c60405160405180910390a3505050565b6000600560008360001916600019168152602001908152602001600020600301549050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156120c157600080fd5b8060078190555050565b60008060056000846000191660001916815260200190815260200160002060020154905060046000826000191660001916815260200190815260200160002060040154915050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60056020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002015490806003015490806004015490806005018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156122455780601f1061221a57610100808354040283529160200191612245565b820191906000526020600020905b81548152906001019060200180831161222857829003601f168201915b5050505050905086565b60046020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002015490806003015490806004015490806005015490806006018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561235f5780601f106123345761010080835404028352916020019161235f565b820191906000526020600020905b81548152906001019060200180831161234257829003601f168201915b5050505050908060070154905088565b60016020528060005260406000206000915054906101000a900460ff1681565b60008060056000846000191660001916815260200190815260200160002060020154905060046000826000191660001916815260200190815260200160002060050154915050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561243557600080fd5b8060068190555050565b600060056000836000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480612509575060011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515145b151561251457600080fd5b60006005600084600019166000191681526020019081526020016000206003015411151561254157600080fd5b600060056000846000191660001916815260200190815260200160002060040154141561264a57612570612c8d565b9050806005600084600019166000191681526020019081526020016000206004018190555060056000836000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600560008460001916600019168152602001908152602001600020600201546000191683600019167fdb5bde2a861282a1b26462a33d0370b5c9567bfe5bdacfd185a10c88901a36b0846040518082815260200191505060405180910390a45b5050565b606060028054806020026020016040519081016040528092919081815260200182805480156126d257602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311612688575b5050505050905090565b600080600754600654915091509250929050565b6000806004600060056000866000191660001916815260200190815260200160002060020154600019166000191681526020019081526020016000206007015414801561275b5750600060056000846000191660001916815260200190815260200160002060040154145b80156127855750600060056000846000191660001916815260200190815260200160002060030154115b9050919050565b600080600060056000856000191660001916815260200190815260200160002060020154905060056000856000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660046000836000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169250925050915091565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561289257600080fd5b8160056000836000191660001916815260200190815260200160002060030154111515156128bf57600080fd5b816005600083600019166000191681526020019081526020016000206003018190555060056000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600560008360001916600019168152602001908152602001600020600201546000191682600019167f21eeb440d114b99bc45f95f31d92ed0a5de1ff45f1c05bbf059f65980b5313c0856040518082815260200191505060405180910390a45050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156129f557600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515612a3157600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60065481565b8160046000826000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515612b6e57600080fd5b612b76612c8d565b8210151515612b8457600080fd5b600060046000856000191660001916815260200190815260200160002060070154141515612bb157600080fd5b816004600085600019166000191681526020019081526020016000206007018190555060046000846000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600460008560001916600019168152602001908152602001600020600201546000191684600019167f8f3b1b0fba0819fea86707163818cc37b3be6d51098d92eb18b7bedc3a5d0c30856040518082815260200191505060405180910390a4505050565b600042905090565b61010060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016000801916815260200160008152602001600081526020016000815260200160608152602001600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10612d4b57805160ff1916838001178555612d79565b82800160010185558215612d79579182015b82811115612d78578251825591602001919060010190612d5d565b5b509050612d869190612e9c565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10612dcb57805160ff1916838001178555612df9565b82800160010185558215612df9579182015b82811115612df8578251825591602001919060010190612ddd565b5b509050612e069190612e9c565b5090565b60c060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600080191681526020016000815260200160008152602001606081525090565b815481835581811115612e9757818360005260206000209182019101612e969190612e9c565b5b505050565b612ebe91905b80821115612eba576000816000905550600101612ea2565b5090565b905600a165627a7a72305820c7cdb35cad4bec65ab5905e30ac3d9c4482bd6532edd895cdc737636fc4fc5380029",
  "compiler": {
    "name": "solc",
    "version": "0.4.24+commit.e67f0147.Emscripten.clang"
  },
  "version": "0.1.0",
  "networks": {}
}