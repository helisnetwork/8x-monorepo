pragma solidity 0.4.24;

import "./Authorizable.sol";

/** @title Gets details of the subscription and terminates it after detecting insufficient tokens */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Collectable is Authorizable {

    /**
      * PUBLIC VIEW FUNCTIONS
    */

    /** @dev Checks if the subscription is valid.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return success is the result of whether the subscription is valid or not.
    */
    function isValidSubscription(bytes32 _subscription)
        public
        view
        returns (bool success);

    /** @dev Gets the token contract address within the subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return subscriptionTokenAddress is token contract address within the subscription.
    */
    function getSubscriptionTokenAddress(bytes32 _subscription)
        public
        view
        returns (address subscriptionTokenAddress);

    /** @dev Returns the from (customer) and to (business) addresses of a subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return from is the address where recurring payments are deducted (customer).
      * @return to is the address where recurring payments are sent (business).
    */
    function getSubscriptionFromToAddresses(bytes32 _subscription)
        public
        view
        returns (address from, address to);

    /** @dev Returns the interval for the subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return interval is the time period denoted in seconds.
    */
    function getSubscriptionInterval(bytes32 _subscription)
        public
        view
        returns (uint interval);

    /** @dev Gets the token amount due from the subscription.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return amount is token amount due from the subscription.
    */
    function getAmountDueFromSubscription(bytes32 _subscription)
        public
        view
        returns (uint amount);

    /** @dev Gets the subscription fee.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
      * @return fee is the subscription fee.
    */
    function getSubscriptionFee(bytes32 _subscription)
        public
        view
        returns (uint fee);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Set the start date for the subscription (first payment made).
      * @param _date is the starting date or date payment was made.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
    */
    function setStartDate(uint _date, bytes32 _subscription)
        public;

    /** @dev Cancel the subscription. User or service node iniated.
      * @param _subscription is the identifier of the customer's subscription with its relevant details.
    */
    function cancelSubscription(bytes32 _subscription)
        public;
}