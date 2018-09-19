# PlanAPI

 The PlansAPI primarily provides functionality for a business to create, get and cancel subscription plans.
A subscription plan is required in order to link a user's commitment with static on-chain data which can't
be manipulated (with the exception of a title and description).

 ## Create plan
`create`


A subscription plan is needed in order to provide an instance for a consumer to subscribe to.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
owner | string | Owner of the subscription identifier | string | External identifier to use to retrieve subscribers interval | number | Interval, in days, to charge a user amount | BigNumber | Amount to charge a user fee | BigNumber | Amount to set as the processing fee name | string | Your organisation/name (eg 'Netflix', 'SaaS dApp'). Shown to user. description | string | Description for your plan (eg 'Premium Plan'). Shown to user. imageUrl |  | Logo for your busines/plan. Shown to user. metaData |  | Any extra data you'd like to store on-chain (JSON format). txData | TxData | Provide signer, gas and gasPrice information (optional). ## Get plan
`get`

> The above command returns JSON structured like this:
  
```
{
owner: '0xbn38s...',
tokenAddress: '0xfns83c...',
identifier: 'com.your.plan.identifier',
interval: 30,
amount: 1000000000000000000, // Most token use 18 decimal places so this is actually 10
fee: 10000000000000000, // Similarly, this is actuall 1/10 of a token
data: '',
name: 'Netflix',
description: 'Premium plan',
imageUrl: 'https://netflix.com/logo,
terminationDate: 155324929, // (epoch - seconds)
}
```

Retrieve the details of a subscription plan

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
planHash | string | Plan hash returned upon creating a plan. ## Get all plans
`getAllFor`


Find all the subscription plans you've created.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
owner | Address | The user who you'd like to get plans for. ## Get subscribers
`getSubscribers`


Get all the subscribers of a subscription plan

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
planHash | Bytes32 | Plan hash returned upon creating a plan ## Cancel plan
`cancel`


Cancel a subscription plan that you've offered to your subscribers.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
planHash | string | Plan hash returned upon creating a plan txData | TxData | Provide signer, gas and gasPrice information (optional).```response[ 0x58e5a0fc7fbc849eddc100d44e86276168a8c7baaa5604e44ba6f5eb8ba1b7eb ]``` # SubscriptionsAPI

The SubscriptionAPI provides all the functionality for consumers to subscribe to 8x. A user must first subscribe to a subscription,
and then they must activate it. Payment is only taken on activation. First time 8x users are required to give pre-authorisation before
they can subscribe however.

## Check pre-authorisation
`hasGivenAuthorisation`


In order for 8x to take tokens directly from a user's wallet, it needs authorisation from a user
to do so. This permission is given through the ERC20 approve function. Through this
functionality you can check whether a user has given approval to the Transfer Proxy (contract
that can take tokens from a user directly).

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
owner | Address | The user to check whether allowance has been given or not```response[ true ]``` ## Give pre-authorisation
`giveAuthorisation`


Grant 8x the pre-authorisation to take tokens from a user's wallet directly. The
pre-authorisation is given to the Transfer Proxy contract.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
txData | TxData | Provide signer, gas and gasPrice information (optional). ## Subscribe
`subscribe`


Subscribing links the user to the subscription plan. It does not take payment from the user.
Payment is only taken when the activate subscription function is called. This is useful in scenarios
where you might want to get a user's commitment and then charge them after a certain duration or amount of usage.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
planHash | Bytes32 | Unique identifying hash of the plan. metaData |  | Any extra JSON data you'd like to pass/store on-chain (optional). txData | TxData | Provide signer, gas and gasPrice information (optional). ## Activate
`activate`


This function can only be called once a user has subscribed as it requires a valid subscription hash.
Provided that a user has subscribed and given authorisation to 8x, the activate function can be called
by any user. We're still exploring the best way to lock this down while still providing enough flexibility.


### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionHash | Bytes32 | Unique subscription hash returned upon subscribing. txData | TxData | Provide signer, gas and gasPrice information (optional). ## All subscriptions
`getSubscribed`


Get all the subscriptions a user has subscribed to.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
user | Address | The user you'd like to get subscriptions for ## Cancel a subscription
`cancel`


Cancels a subscription and prevents payments from being taken next billing cycle.
This can only be called by the user who created the subscription in the first place.

### Request Parameters
Name | Type | Comment 
---- | ---- | ------- 
subscriptionHash | Bytes32 | Unique subscription hash returned upon subscribing. txData | TxData | Provide signer, gas and gasPrice information (optional). 