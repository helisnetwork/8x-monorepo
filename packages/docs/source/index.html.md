---
title: 8x API

language_tabs: # must be one of https://git.io/vQNgJ
  - typescript

toc_footers:
  - <a href='#'>Go to the manage portal</a>

includes:
  - api

search: true
---

# Introduction

Welcome to the 8x API! You can use our API to interface with our smart contracts without knowing the underlying architeture.

We have language bindings in JavaScript/Typescript. You can view code examples in the dark area to the right.

# Installation

## 8x.js

Install the 8x.js SDK by simply running:

`npm install 8x.js`

## BigNumber.js

Since Solidity deals with integers up to 2^256, we need to utilise Bignumber.js to represent these large integers in Javascript (maximum 2^53).
To ensure comaptibility make sure you install version 4.1.0 of Bignumber.js.

`npm install bignumber.js @ ^4.1.0`

## Web3

Web3 is a library used to interface with the blockchain. We're currently using version 0.2.0 as 1.0 introduces breaking changes.
To ensure compatibility please make sure you install/pass a 0.2.0 version of web3 to 8x.js

`npm install web3 @ ^0.2.0`

# Configuration

To utilise the 8x.js library simply import it by calling:

`import eightEx from '8x.js'`

After you've done that you'll need to instantiate an instance of `eightEx` by passing a `web3` instance and an `AddressBook`.

## Address Book

What's an address book you may be asking? Good question. In order to interact with 8x.js you'll need to pass the relevant contract addresses for the network you'd like to interface with.

Here's how an `AddressBook` looks like:

```typescript
{
  approvedRegistryAddress?: Address;
  executorAddress?: Address;
  paymentRegistryAddress?: Address;
  requirementsAddress?: Address;
  stakeContractAddress?: Address;
  transferProxyAddress?: Address;
  volumeSubscriptionAddress?: Address;
  transactingTokenAddress?: Address;
  kyberAdress?: Address;
}
```

As you can see to the right, all the parameters are optional however we recommend you passing in all the addresses to ensure everything works as expected.

You can get a list of the currently deployed addresses from [HERE](https://github.com/8xprotocol/monorepo/blob/master/packages/artifacts/src/addresses/config.json)

## Web3

In case you've never worked with Web3, an easy way to get an instance of it is from the user's browser (assuming they have it).

```typescript
const provider = window.web3.currentProvider;
const web3 = new Web3(provider);
```

> NOTE: You won't be able to do this in the near future as Metamask is deprecating the ability for applications to pull web3 directly from a user's browser.