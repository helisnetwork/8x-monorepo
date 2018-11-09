<p align="center"><img src="https://8xprotocol.com/assets/images/full-logo.png" width="280"/></p>

<p align="center">8x Protocol enables decentralised recurring payments on the Ethereum blockchain.<br>A complete explanation of the protocol may be found in our whitepaper (https://github.com/8xprotocol/whitepaper).</p>

<p align="center">
  <a href="http://t.me/eightexprotocol_contributors">
    <img src="https://img.shields.io/badge/CHAT-TELEGRAM-0088cc.svg" />
  </a>
  <a href="https://solidity.readthedocs.io/en/develop/index.html">
    <img src="https://img.shields.io/badge/SOLIDITY-0.4.24-orange.svg" />
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/LICENSE-APACHE2.0-3DA639.svg" />
  </a>
</p>

## Packages :package:

### Published

|                            Package                             |                                                                Version                                                                |                           Description                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`8x.js`](/packages/8x.js)                                     | [![npm](https://img.shields.io/npm/v/8x.js.svg)](https://www.npmjs.com/package/8x.js)                                                 | A Javascript library for interacting with the 8x protocol       |
| [`8x.pay`](/packages/8x.pay)                                   | [![npm](https://img.shields.io/npm/v/8x.pay.svg)](https://www.npmjs.com/package/8x.pay)                                               | Payment gateway for consumers to pay with 8x                    |
| [`@8xprotocol/artifacts`](/packages/artifacts)                 | [![npm](https://img.shields.io/npm/v/@8xprotocol/artifacts.svg)](https://www.npmjs.com/package/@8xprotocol/artifacts)                 | Type and schema assertions used by our packages                 |
| [`@8xprotocol/base-contract`](/packages/base-contract)         | [![npm](https://img.shields.io/npm/v/@8xprotocol/base-contract.svg)](https://www.npmjs.com/package/@8xprotocol/base-contract)         | BaseContract used by auto-generated `abi-gen` wrapper contracts |
| [`@8xprotocol/dev-utils`](/packages/dev-utils)                 | [![npm](https://img.shields.io/npm/v/@8xprotocol/dev-utils.svg)](https://www.npmjs.com/package/@8xprotocol/dev-utils)                 | Developer utilities                                             |
| [`@8xprotocol/service-node-core`](/packages/service-node-core) | [![npm](https://img.shields.io/npm/v/@8xprotocol/service-node-core.svg)](https://www.npmjs.com/package/@8xprotocol/service-node-core) | Core engine behind service node                                 |
| [`@8xprotocol/types`](/packages/types)                         | [![npm](https://img.shields.io/npm/v/@8xprotocol/types.svg)](https://www.npmjs.com/package/@8xprotocol/types)                         | Shared type declarations                                        |

### Private

|                       Package                        |              Description              |
| ---------------------------------------------------- | ------------------------------------- |
| [`@8xprotocol/contracts`](/packages/contracts)       | 8x solidity smart contracts & tests   |
| [`@8xprotocol/docs`](/packages/docs)                 | Documentation site created with Slate |
| [`@8xprotocol/service-node`](/packages/service-node) | Node to process subscriptions         |


## Addresses :innocent:

We get it, you're just here to find the contract addresses. Luckily for you, they're all listed here.

### Contracts (Kovan)

| Contract Name | Address |
| ------------- | ------- |
| Executor | 0x470194d300f9304c22de2b2379f4d6707929a826 |
| VolumeSubscription | 0x83e707e542ade68e9e350cbd7e9e973d5ff1e192 |
| ApprovedRegistry | 0x7499ff1e557ccf2c0984942f19f0414381bd9438 |
| TransferProxy | 0xa49f09793d618d861351359ab0fbbd4751487e8a |
| PaymentRegistry | 0xe8cb0fb5820fe6a79533f19b5ec2497d572c1c49 |
| Requirements | 0x6042c4ceeeba5566c559bbd21b7cd7a27f0522ed |
| EightExToken | 0x79468d682f46818c39f069556601b1e55cf5f56e |
| StakeContract | 0x1a85078869da113a0568544cce40ea8b8db2556f |
| KyberNetwork | 0x67376cb28db40294cba0ec3db6e152d4bd6ab3bc |

### Supported Tokens (Kovan)

| Token Ticker | Address |
| ------------ | ------- |
| DAI | 0xc4375b7de8af5a38a93548eb8453a498222c4ff2 |


## Contributing :raising_hand_woman:
We appreciate your desire to contribute to the 8x Protocol. We strive to maintain
a high standard over code quality and the security of our contracts. Please read over
this contributor guide before starting.

### How to Contribute
If you would like to contribute please fork the repo, create a new branch, fix the problem, commit the work with a clear message about what was accomplished, and submit a pull request.

### Code Quality
- When adding functionality, please also add tests and make sure they pass
- When adding a new function, make sure to add comments that adhere to the format seen throughout the project
- When fixing conflicts please use `rebase`
- When updating your working branch with `upstream master` changes, please `rebase`
- Make sure there are no linter `warnings` or `errors`

##### Requirements
- Truffle ^4.1.8
- Gananche UI
- NPM

##### Pre Requisites
```
npm install -g lerna
npm install -g truffle
npm install -g typescript@2.6.2
```

##### Compiling All Packages
```
lerna run build
```

##### Running All Tests
```
lerna run test
```