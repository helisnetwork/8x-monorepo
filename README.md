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
| Executor | 0x22c4046aaa3e4c917a480b78ab0539e58263cf07 |
| VolumeSubscription | 0x861fbac3de50783b9f7a6bd2bcc03f2298efce1c |
| ApprovedRegistry | 0x61fc3a2e1518e7f16d5f18e885d1f9723aed79c4 |
| TransferProxy | 0x0a890f03cf67a0fd392a1320ad4572af8d05699b |
| PaymentRegistry | 0x08662d37eb59071d4528e67ed3c95bea84b0c65e |
| EightExToken | 0x42f71046d88e926f72d6aca4ad491786e0a826a4 |
| StakeContract | 0x5ffd8b6560821a3597eb208dd99cf3db57b67ec9 |
| KyberNetwork | 0x7e6b8b9510D71BF8EF0f893902EbB9C865eEF4Df |

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
npm install -g ganache-cli
```

##### Compiling All Packages
```
lerna run build
```

##### Running All Tests
```
lerna run test
```
