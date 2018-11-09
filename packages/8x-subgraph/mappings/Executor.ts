import { SubscriptionActivated, SubscriptionProcessed, SubscriptionCancelled } from '../types/schema';
import { Entity, store } from '@graphprotocol/graph-ts';
import { SubscriptionActivated as SubscriptionActivatedEvent, SubscriptionProcessed as SubscriptionProcessedEvent , SubscriptionCancelled as SubscriptionCancelledEvent } from '../types/ExecutorContract/Executor'

// Required for dynamic memory allocation in WASM / AssemblyScript
import 'allocator/arena';
export { allocate_memory };

export function handleSubscriptionActivated(event: SubscriptionActivatedEvent): void {
  let id = event.params.subscriptionIdentifier.toHex();
  
  let subscriptionActivationToken = new SubscriptionActivated();

  subscriptionActivationToken.subscriptionAddress = event.params.subscriptionAddress
  subscriptionActivationToken.tokenAddress = event.params.tokenAddress
  subscriptionActivationToken.dueDate = event.params.dueDate
  subscriptionActivationToken.amount = event.params.amount
  subscriptionActivationToken.fee = event.params.fee


  store.set('SubscriptionActivated', id, subscriptionActivationToken);
}

export function handleSubscriptionProcessed(event: SubscriptionProcessedEvent): void {
  let id = event.params.subscriptionIdentifier.toHex();
  
  let subscriptionProcessedToken = new SubscriptionProcessed();

  subscriptionProcessedToken.claimant = event.params.claimant
  subscriptionProcessedToken.dueDate = event.params.dueDate
  subscriptionProcessedToken.staked = event.params.staked

  store.set('SubscriptionProcessed', id, subscriptionProcessedToken);
}

export function handleSubscriptionCancelled(event: SubscriptionCancelledEvent): void {
  let id = event.params.subscriptionIdentifier.toHex();
  
  let subscriptionCancellationToken = new SubscriptionCancelled();

  subscriptionCancellationToken.subscriptionAddress = event.params.subscriptionAddress


  store.set('SubscriptionCancelled', id, subscriptionCancellationToken);
}