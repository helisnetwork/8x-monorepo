import { SubscriptionActivated, SubscriptionProcessed, SubscriptionCancelled } from '../types/schema';
import { Entity, store } from '@graphprotocol/graph-ts';
import { SubscriptionActivated, SubscriptionProcessed, SubscriptionCancelled } from '../types/ExecutorContract/Executor'


export function handleSubscriptionActivated(event: SubscriptionActivated): void {
  let id = event.params.subscriptionIdentifier.toHex();
  
  let subscriptionActivationToken = new SubscriptionActivated();

  subscriptionActivationToken.subscriptionAddress = event.params.subscriptionAddress
  subscriptionActivationToken.tokenAddress = event.params.tokenAddress
  subscriptionActivationToken.dueDate = event.params.dueDate
  subscriptionActivationToken.amount = event.params.amount
  subscriptionActivationToken.fee = event.params.fee


  store.set('SubscriptionActivated', id, subscriptionActivationToken);
}

export function handleSubscriptionProcessed(event: SubscriptionProcessed): void {
  let id = event.params.subscriptionIdentifier.toHex();
  
  let subscriptionProcessedToken = new SubscriptionProcessed();

  subscriptionProcessedToken.claimant = event.params.claimant
  subscriptionProcessedToken.dueDate = event.params.dueDate
  subscriptionProcessedToken.staked = event.params.staked

  store.set('SubscriptionProcessed', id, subscriptionProcessedToken);
}

export function handleSubscriptionCancelled(event: SubscriptionCancelled): void {
  let id = event.params.subscriptionIdentifier.toHex();
  
  let subscriptionCancellationToken = new SubscriptionCancelled();

  subscriptionCancellationToken.subscriptionAddress = event.params.subscriptionAddress


  store.set('SubscriptionCancelled', id, subscriptionCancellationToken);
}