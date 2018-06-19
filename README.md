# 8x Protocol

## What is it?

8x protocol is a way to enable decentralised recurring payments on the Ethereum blockchain. You can read more about it at:

Whitepaper: https://github.com/8x-protocol/whitepaper

Website: http://8xprotocol.com/

Telegram: https://t.me/eightexprotocol

Medium: https://medium.com/8x-protocol/

Twitter: https://twitter.com/8x_Protocol

## Current State

The protocol is still at an early stage although majority of the architecture has been outlined in the whitepaper.

## Next Steps

Below are the technical things required to create a MVP of the protocol:

### To-Think
- Design architecture for how the TransactionRegistry is going to work in relation to an upgradeable and modular architecture.
- Think about how service nodes are rewarded for finding bad actors (people who don't execute on their subscriptions on time). Subsequently, we need to record how long it took them to actually execute the transaction the first time so they're bounded by that SLA (if that's the right term) in the future too.
- Have a strategy for how changes to a multiplier will be handled to existing stakes in subscriptions.
- Determine whether the Collectible interface is needed in the first place and whether the logic for handling each type of contract should be in the executor itself. Can't think of an exact use case of how the Collectible interface might be restrictive but still worth thinking about neverthless.

### To-Do
- Change implementation of Volume Subscription so that a new subscription can only be created by the executor (so it can be added the transaction registry).
- Finish off the implementation of Exector.sol and its tests.
- Implement transaction registy.
- Implement subscription registry.
- Add a well-audited multi-sig wallet with a timelock function.
- Add proper deployment scripts that make the multi-sig wallet with time lock the owner.
- Optimize the type of ints used. Right now every int is uint256 which isn't too good.
- Create a Donation subscription interface with the accompanying tests.

### To-Check

- Check for integer overflows and underflows.
- Check for re-entry attacks.
- Check to ensure safe push payments are made to subscription owner (might need to change this to pull but it'd be cheaper & cooler if it's push).
- Check all failing test cases are implemented.
- Check return values are within the range we expect them to be.

### To-Celebrate
- ~~Create mocks to facilitate the testing of more complex time logic.~~
- ~~Ensure tests run consistently (this is something to do with the calculation of time). Checkout https://github.com/trufflesuite/truffle/issues/920#issuecomment-385022886 for more information.~~

There's more but this is the most I can think of at this stage. Feel free to get in touch with me at kermankohli@gmail.com or @kermankohli (on Telegram) if you have any questions.