pragma solidity ^0.4.21;

import "./Authorizable.sol";

/** @title Gets details of the subscription and terminates it after detecting insufficient tokens */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract Collectable is Authorizable {

    /**
      * Public view functions
    */

    /** @dev Checks if the subscription is valid.
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.
      * @return  success is the result of whether the subscription is valid or not.
    */

    function isValidSubscription(bytes32 _subscription)
        view
        public
        returns (bool success);

    /** @dev Gets the token contract address within the subscription.
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.
      * @return subscriptionTokenAddress is token contract address within the subscription.
    */

    function getSubscriptionTokenAddress(bytes32 _subscription)
        view
        public
        returns (address subscriptionTokenAddress);

    /** @dev Gets the address from address and to address within the subscription.
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.
      * @return from is the address where the recurring payments will be deducted from (the customer).
      * @return to is the address where the recurring payments will be paid to (i.e. the business).
    */

    function getSubscriptionFromToAddresses(bytes32 _subscription)
        view
        public
        returns (address from, address to);

    /** @dev Gets the token balance of the address where the recurring payments will be deducted from (the customer).
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.
      * @return balance is the token balance of the address where the recurring payments will be deducted from (the customer).      
    */

    function getSubscriptionOwnerBalance(bytes32 _subscription)
        view
        public
        returns (uint balance);

    /** @dev Gets the token amount due from the subscription.
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.
      * @return amount is token amount due from the subscription.
    */

    function getAmountDueFromSubscription(bytes32 _subscription)
        view
        public
        returns (uint amount);

    /** @dev Gets the subscription fee.
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.
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
      * @param _subscription is the identifier of the customer's subscription with it's relevant details.      
    */
    // @TODO: Deduct a penalty fee after detecting insufficient tokens. 
    //        The first subscription payment should be marked up to include the penalty fee.

    function terminateSubscriptionDueToInsufficientFunds(bytes32 _subscription) onlyAuthorized public;

}