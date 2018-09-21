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

## What is 8x?

8x is a Ethereum based protocol to facilitate the transfer of recurring subscription payments.

The key issue 8x solves is the inability to schedule a transaction on a blockchain every month, automatically.
We solve this through a network of layer 2 service nodes that actively watch for subscriptions that need to be processed, execute it on behalf of the user, pay the required gas fee and are earn a fee.

In the case that a service node doesn't excecute a subscription, their tokens are stolen from another node and the subcription is processed. This ensures that subscriptions don't go unprocessed forever.

## How does it all work?

There's quite a lot to take in, so here's a simplified lifecycle of a subscription.

1. Business/developer creates a plan via API or manage portal. A plan hash is returned.
2. User gives allowance for 8x to take tokens from their wallet (we don't use an escrow)
3. The user subscribes to a plan with the plan hash.
4. A subscription hash is returned.
5. The user activates a subscription with the subscription hash.
6. The first payment is made.
7. When the next payment is due, service nodes are eligible to process the subscription on the user's behalf.
8. Higher the subscription fee, the quicker service nodes will process subscriptions.
9. The process is continually processed by the same service node.
10. Service nodes can choose to opt-out of processing a subscription and another node can process it instead (automaticaly).

## What do I need to know?

Not much, except for the fact that a subscription can have 3 states:

- Active
- Processing
- Inactive

If a the subscription is being processed, you'll know whether the user has enough funds in their wallet and if 8x has authorisation to take funds from their wallet.

> There is a maximum time period for how long a subscription can be under processing though.

It's up to you how you would like to handle the processing state.

# Installation

We have language bindings in JavaScript/Typescript. You can view code examples in the dark area to the right.

### 8x.js

Install the 8x.js SDK by simply running:

`npm install 8x.js`

### BigNumber.js

Since Solidity deals with integers up to 2^256, we need to utilise Bignumber.js to represent these large integers in Javascript (maximum 2^53).
To ensure comaptibility make sure you install version 4.1.0 of Bignumber.js.

`npm install bignumber.js @ ^4.1.0`

### Web3

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

## EightEx

```typescript
import eightEx from '8x.js'

const provider = window.web3.currentProvider;
const web3 = new Web3(provider);

const addressBook = {
  approvedRegistryAddress: '0x...'.
  executorAddress: '0x...',
  paymentRegistryAddress: '0x...',
  requirementsAddress: '0x...',
  stakeContractAddress: '0x...',
  transferProxyAddress: '0x...',
  volumeSubscriptionAddress: '0x...',
  transactingTokenAddress: '0x...',
  kyberAdress: '0x...',
};

const eightEx = new EightEx(web3, addressBook);
```

To make a long story short, here's how you might instantiate an instance of 8x (shown to the right).

We highly recommend passing in all the addresses, however if you know *for sure* you're not going to be interacting with certain components then feel free to not pass in that contract's address.