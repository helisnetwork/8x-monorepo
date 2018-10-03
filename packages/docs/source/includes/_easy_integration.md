# Easy Integration

In order to make receiving payments as simple as possible, we've made the whole process take less than 2 minutes (depending on how long `npm install` takes 😬).

Please note we currently only support React. We'll be adding support for drag and drop HTML soon though!

```typescript\
<EightExPay
  planHash='0x..'
  activation={(subscriptionHash) => {
    // The subscription hash is the identifier to track the status of a user's subscription
    // This also means the checkout process went through smoothly
    console.log('$$$');
  })
/>
```

1. Create a subscription plan by heading over to the [manage portal](https://manage.8xprotocol.com)
2. Run `npm install 8x.pay`
3. Add `<EightExPay planHash='0x...'/>` in your react file
4. That's it! You can now charge your users subscription payments on the blockchain!

> Your plan hash is shown below your plan in the manage portal

IMPORTANT: While testing please make sure you do not subscribe to your own plan. Ensure you have a separate account for the business and consumer.

All functionality only runs on Kovan at this stage.

## Checking subscription status

We currently don't support callback URLs (in our immediate roadmap though). However, you can query using `8x.js` to check the status of a subscription using the subscription hash.

We recommend reading the `Subscriptions` section of the documentation for more information.