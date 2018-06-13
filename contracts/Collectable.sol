pragma solidity ^0.4.21;

import "./Authorizable.sol";

/** @title Gets details of the subscription and terminates it after detecting insufficient tokens */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract Collectable is Authorizable {

    /**
      * Public view functions
    */

    /** @dev Checks if the subscription is valid.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return success is the result of whether the subscription is valid or not.
    */

    function isValidSubscription(bytes32 _subscription)
        view
        public
        returns (bool success);

    /** @dev Gets the token contract address within the subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return subscriptionTokenAddress is token contract address within the subscription.
    */

    function getSubscriptionTokenAddress(bytes32 _subscription)
        view
        public
        returns (address subscriptionTokenAddress);

    /** @dev Returns the from (customer) and to (business) addresses of a subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return from is the address where recurring payments are deducted (customer).
      * @return to is the address where recurring payments are sent (business).
    */

    function getSubscriptionFromToAddresses(bytes32 _subscription)
        view
        public
        returns (address from, address to);

    /** @dev Gets token balance of the subscription owners address.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return balance is the token balance of the address where the recurring payments will be deducted from (the customer).      
    */

    function getSubscriptionOwnerBalance(bytes32 _subscription)
        view
        public
        returns (uint balance);

    /** @dev Gets the token amount due from the subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return amount is token amount due from the subscription.
    */

    function getAmountDueFromSubscription(bytes32 _subscription)
        view
        public
        returns (uint amount);

    /** @dev Gets the subscription fee.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return fee is the subscription fee.
    */

    function getSubscriptionFee(bytes32 _subscription)
        view
        public
        returns (uint fee);

    /**
      * Public functions
    */

    /** @dev Terminate the subscription after detecting that there are insufficient tokens.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
    */
    // @TODO: Deduct a penalty fee after detecting insufficient tokens. 
    //        The first subscription payment should be marked up to include the penalty fee.

    function terminateSubscriptionDueToInsufficientFunds(bytes32 _subscription) onlyAuthorized public;

}