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
| Executor | 0x2cfc66eff1610a2aa3288bbe25660a1c36969342 |
| VolumeSubscription | 0x683c424996e92538c50dade2f5a1702d0c215de7 |
| PayrollSubscription | 0xe52310e6d3b9cc95be1d7336a142fd77520cc4e8 |
| ApprovedRegistry | 0x976213331bfec2c9123f94f173eed9e116b1907d |
| TransferProxy | 0x636fa4074c5c029de5358011b02dc665ae6253dd |
| PaymentRegistry | 0x5a04ed2dca463998069294cdaf275c835b2e731f |
| EightExToken | 0xf0564376959e80657325c89a774786308649e499 |
| WETH | 0xecd1366b743e2b7e9c9ba3a7cdde6348db214653 |
| StakeContract | 0x587607646c1b562d0a3221fe7d3c622d9d0d47c6 |
| KyberNetwork | 0x62a7fd42afd4587831d3d67e3469818863a7c48c |
| MultSig | 0x85c441e2e701ef5e95a1b05dd7ec23ebc5d0df5a |

### Supported Tokens (Kovan)

| Token Ticker | Address |
| ------------ | ------- |
| DAI | 0xc4375b7de8af5a38a93548eb8453a498222c4ff2 |
| WETH | 0xecd1366b743e2b7e9c9ba3a7cdde6348db214653 |

### Contracts (Mastery - AION)

| Contract Name | Address |
| ------------- | ------- |
| Executor | 0xa04872919895E8Fd2E61911328ff4Ae391f15CCF26510e3206C77ab7c48ec25f |
| PayrollSubscription | 0xa0A46bE59265bf81bcacA21a3f09513c0534E6B929248754c5e95979e2A7481c |
| ApprovedRegistry | 0xA0863Ee2ae5EeeC88BB2889FDD2e8F37821d637748b8D18CaDef4fc2022c1c16 |
| TransferProxy | 0xa04e3d8Fbb331Af4D54fE845d342dD4c775E88D4Fe8598c51856EAF75A634D46 |
| PaymentRegistry | 0xa0DB8AEFb181B03653f4694a13f423f92ed36130d6E9dEF103B6182e7c8aCD25 |
| EightExToken | 0xa0c6E2b78DA659963DA76248398D725819207a2dA1468FB131f4d274310CC2A2 |
| WETH | 0xa049496593CAdbf1542baDdabbebB46FCD00754519F6D44CE41aEE94A4ED0B25 |
| StakeContract | 0xa044d909747874307517f6F013d7803Ad1CF0a21c242E3E675215eae43469474 |
| MultSig | 0xA059d349739e8BAAa7ED83ec345Ea67C9939ec2f22d0bD0f18304610AD7741b0 |

### Supported Tokens (Mastery - AION)

| Token Ticker | Address |
| ------------ | ------- |
| WAION | 0xa049496593CAdbf1542baDdabbebB46FCD00754519F6D44CE41aEE94A4ED0B25 |


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
