# ExecutorAPI

The executor contract is the heart of the 8x protocol. It's
primary responsibility is to bring various components together
and coordinate between them. For more information we recommend
reading the white paper.

## Activate Subscription
`activateSubscription`

```typescript
const eightEx = require('eightEx');
let response = await eightEx.activateSubscription(
'0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4'
'0x0213e3852b8afeb08929a0f448f2f693b0fc3ebe'
)
```

> The above command returns JSON structured like this:
  
```
true
```

In order to make the first payment, activate subscription needs to
be called to start the subscription. This change is then reflected
in the volume subscription contract where the start date is updated.

The creation of a subscription in volume subscription and activation
can be decoupled to create a trial functionality.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionContract | Types.Address | The subscription contract you'd like tointerface with. subscriptionIdentifier | Types.Bytes32 | The identifier of the subscription you'dlike to activate/make the first payment for. ## Cancel Subscription
`cancelSubscription`


If a user doesn't have enough funds, the subscription was cancelled by
the user/business, allowance was revoked etc. The service node has a
fail safe way to cancel the subscription and get back their stake of
tokens.

They also get a gas refund by deleting the payment registry object.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionContract | Types.Address | The subscription contract you'd like tointerface with. subscriptionIdentifier | Types.Bytes32 | The identifier of the subscription you'dlike to activate/make the first payment for. ## Catch Late Subscription
`catchLateSubscription`


If a service node doesn't process a subscription for a valid reason (
user doesn't have enough funds, allowance revoked, subscription
cancelled) then another user can catch their late processing, steal
their tokens and now take on the responsibility of processing the
subscription. It is for this reason that service nodes must carefully
set how quickly they'd like to process subscriptions.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionContract | Types.Address | The subscription contract you'd like tointerface with. subscriptionIdentifier | Types.Bytes32 | The identifier of the subscription you'dlike to activate/make the first payment for. ## Determine Stake
`determineStake`


To know how many tokens are need to process a subscription, this
function can be called. It relies on a few variables such as the
gini coefficient, time elapsed since the subscription was processed
and the total number of unstaked tokens in the system.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
tokenAddress | Types.Address | Address of the token which is being processed. startDate | Types.UInt | The due date of the subscription. interval | Types.UInt | The interval of the subscription. ## Process Subscription
`processSubscription`


When a subscription is due a service node can go ahead and call this
function.

If it's an unclaimed subscription, they'll need enough tokens. Otherwise
it will ensure that the original claimer only has the right to call
this function.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionContract | Types.Address | The subscription contract you'd like tointerface with. subscriptionIdentifier | Types.Bytes32 | The identifier of the subscription you'dlike to activate/make the first payment for. ## Release Subscription
`releaseSubscription`


In the case a service node would like to stop processing a subscription
they can release the subscription provided they are within a certain
time period.

The time period is set through the maximum interval divisor in the executor
contract. If the subscription has an interval of 30 and the divisor is set
at 6 then you have 5 days to release a subscription once it's been processed.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionContract | Types.Address | The subscription contract you'd like tointerface with. subscriptionIdentifier | Types.Bytes32 | The identifier of the subscription you'dlike to activate/make the first payment for. 