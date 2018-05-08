# 8x Protocol

## What is it?

8x protocol is a way to enable decentralised recurring payments on the Ethereum blockchain. You can read more about it at: https://github.com/8x-protocol/whitepaper.

## Current State

The protocol is still at an early stage although majority of the architecture has been outlined in the whitepaper.

## Next Steps

Below are the technical things required to create a MVP of the protocol:
- ~~Ensure tests run consistently (this is something to do with the calculation of time). Checkout https://github.com/trufflesuite/truffle/issues/920#issuecomment-385022886 for more information.~~
- Change implementation of Volume Subscription so that a new subscription can only be created by the executor (so it can be added the subscription registry)
- Finish off the implementation of Exector.sol and its tests
- ~~Create mocks to facilitate the testing of more complex time logic~~
- Implement subscription registy (currently in progress)
- Add a well-audited multi-sig wallet with a timelock function
- Add proper deployment scripts that make the multi-sig wallet with time lock the owner
- Check for integer overflows
- Create a Donation subscription interface with the accompanying tests

There's more but this is the most I can think of at this stage.