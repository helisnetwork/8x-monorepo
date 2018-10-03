# Service Nodes

Before we learn how a service node works, it's important to know the reason why service nodes exist in the first place.

The reason why subscription payments aren't possible on layer 1 is due to the fact that blockchain transactions can't be scheduled or repeated (without using a centralised CRON server or creating an escrow contract).

The 8x network aims to solve this gap by coordinating a network of layer 2 nodes to execute transactions on behalf of a user/business.

## Claiming Problem

Service nodes are essentially just layer 2 economic actors calling a smart contract at a particular time every month. Since nodes are incentivised to earn a fee (set by the business) to process a subscription, we run into a major problem of multiple service nodes calling a smart contract at the same time to earn a fee.

Consider the following simplistic example, Bob and Alice spend 75 wei to earn a fee of 150 wei to process a subscription on behalf of a user. They both have a *50%* chance of winning 150 wei, however they both have an upfront cost of 75 wei in gas to call the smart contract. This might seem fine, however if we have 1000 such nodes the expected probability of profit is worth far less than the reward.

Compounding this problem, we can't randomly choose a node every month due to the deterministic nature of Ethereum. Hence we need a way for all actors to coordinate without getting into gas wars.

## Proof of Priority

Our solution to the claim problem is what we call "Proof of Priority". Since all currencies have inequality (pareto's principal), we can use this property to coordinate a network of profit seeking service nodes. Also, each subscription has it's own expected profit based on the subscription amount, fee and  churn rate based on vendor.

Suppose there are a total of 1000 unstaked 8x tokens in the network with the largest holder holding 10% of the total tokens, when a subscription payment is due, the starting stake starts at 1000 * 0.10 = 100. Then, as time goes along the stake decreases exponentially based on an approximate gini coefficient of the system. However, when a service node claims a subscription a percentage of their stake is locked up regardless of the actual minimum stake. Through this mechanism we create a free market where each actors has a different strategy for deploying their capital (one node with the highest priority or multiple nodes with decreasing priorities).

In the case that two nodes have similar token stakes and have submitted a transaction in the pool, the node with a lower stake will voluntarily cancel their pending transaction to avoid wasted gas. While this may sound unreasonable, it actually is advantageous for the service node since the total unstaked tokens in the system has decreased hence giving them a higher priority next time.

## Staking

Staking serves two purposes in the 8x network:

1. To make service nodes carefully choose which subscriptions to process
2. Ensure that they continue to process subscriptions on time every month

Continuing on from the above section, the next time a subscription is processed by the same service node the required stake is recalculated. If the required stake is lower than what they had staked last time, the difference will be returned to them. Hence, as the total subscription volume in the system increases, the number of tokens required for a subscription will decrease (less unstaked tokens in the system).

In the case that a service node doesn't process a subscription the following month, any service node on the network can steal their tokens and process the subscription on their behalf. The amount of time a service node has to process is based on the different between the due date of the first payment and when they claimed it. This effectively means service nodes are setting their own SLAs for businesses. The more attractive a subscription, the lower the expected SLA a business can expect from a service node.


## To be continued...