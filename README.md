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
| Executor | 0x9d3dc1ef688ff4527461c105ca1dc29f4f6b8c12 |
| VolumeSubscription | 0xfb7663927db308b9dfb7a6e2acea0121010e67b1 |
| ApprovedRegistry | 0x1ef76445bab316fcf6b2da58a839d40970efbdd7 |
| TransferProxy | 0x9c6a398079e9076eb7315e12617291ad1b178b2b |
| PaymentRegistry | 0x060e32aeb107182af6d79c66c1b3e334b927f72e |
| EightExToken | 0x8a55b11304fba2e090912f75ab8d4f734ad098a1 |
| StakeContract | 0x76fad650abf395e3cfa2fc867c92e13660e5794b |
| KyberNetwork | 0x427d5cfe3ebfb87df94e8a003af4afd0c76031e8 |
| MultSig | 0x9cbd8823773bff919540e6ba3de4ed684310d917 |

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
