pragma solidity ^0.4.21;

import "./Authorizable.sol";

contract Collectable is Authorizable {

    function isValidSubscription(bytes32 _subscription)
        view
        public
        returns (bool success);

    function getSubscriptionTokenAddress(bytes32 _subscription)
        view
        public
        returns (address subscriptionTokenAddress);

    function getSubscriptionFromToAddresses(bytes32 _subscription)
        view
        public
        returns (address from, address to);

    function getSubscriptionOwnerBalance(bytes32 _subscription)
        view
        public
        returns (uint balance);

    function getAmountDueFromSubscription(bytes32 _subscription)
        view
        public
        returns (uint amount);

    function getSubscriptionFee(bytes32 _subscription)
        view
        public
        returns (uint fee);

    function terminateSubscriptionDueToInsufficientFunds(bytes32 _subscription) onlyAuthorized public;

}