---
title: 8x API

language_tabs: # must be one of https://git.io/vQNgJ
  - typescript

toc_footers:
  - <a href='#'>Go to the manage portal</a>

includes:
  - easy_integration
  - api_introduction
  - api
  - service_nodes

search: true
---

# What is 8x?

8x is a Ethereum based protocol to facilitate the transfer of recurring subscription payments.

The key issue 8x solves is the inability to schedule a transaction on a blockchain every month, automatically.
We solve this through a network of layer 2 service nodes that actively watch for subscriptions that need to be processed, execute it on behalf of the user, and earn a fee.

In the case that a service node doesn't execute a subscription, another node can steal their tokens and process the subscription. This ensures that subscriptions don't go unprocessed forever.