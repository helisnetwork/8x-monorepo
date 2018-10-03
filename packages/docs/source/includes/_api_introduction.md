# API Introduction

In the case you don't use React or want more granular control over the implementation...

## How do I charge my users?

There are a few steps at the moment, however, we plan to simplify this in the upcoming iterations of the protocol.

1. Create a subscription plan, plan hash returned on success
2. Check if the user has given allowance (ERC20) to 8x
3. If not, give approval
4. The user subscribes by using a plan hash, subscription hash returned on success
5. The user activates the subscription, the first payment is made

## How do I know if a user has paid?

A subscription can have 3 states:

- Active
- Processing
- Inactive

If a subscription is being processed, you'll know whether the user has enough funds in their wallet and if 8x has the authorisation to take funds from their wallet.

It's up to you how you would like to handle the processing state.

> There is a maximum time period for how long a subscription can be under processing.

# Installation

Our library is written in Typescript and utilises other 8x Protocol packages.

### 8x.js

Install the 8x.js SDK by simply running:

`npm install 8x.js`

### BigNumber.js

Since Solidity deals with integers up to 2^256, we need to utilise Bignumber.js to represent large integers in Javascript (maximum 2^53).
To ensure compatibility make sure you install version 4.1.0 of Bignumber.js.

`npm install bignumber.js @ ^4.1.0`

### Web3

Web3 is a library used to interface with the blockchain. We're currently using version 0.2.0 as 1.0.0 introduces breaking changes.
To ensure compatibility please make sure you instantiate a 0.2.0 version of web3 to 8x.js

`npm install web3 @ ^0.2.0`

# Configuration

To utilise the 8x.js library simply import it by calling:

`import eightEx from '8x.js'`

After you've done that you'll need to instantiate an instance of `eightEx` by passing a `web3` instance and an `AddressBook`.

## Address Book

In order to interact with 8x.js, you'll need to pass the relevant contract addresses based on the network you'd like to interface with.

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

All the parameters are optional, however, we recommend you pass through all the addresses to ensure everything works as expected.

You can get a list of the currently deployed addresses from [here](https://github.com/8xprotocol/monorepo/blob/master/packages/artifacts/src/addresses/config.json)

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

We highly recommend passing in all the addresses, however, if you know *for sure* you're not going to be interacting with certain components then feel free to not pass in that contract's address.