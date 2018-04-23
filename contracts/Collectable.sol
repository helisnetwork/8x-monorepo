pragma solidity ^0.4.21;

import "./Authorizable.sol";

contract Collectable is Authorizable {

    function isValidSubscription(bytes32 _subscription) 
        view
        public
        returns (bool _success);

    function getSubscriptionOwnerBalance(bytes32 _subscription)
        view
        public
        returns (uint _balance);

    function getAmountDueFromSubscription(bytes32 _subscription) 
        view
        public
        returns (uint _amount);

    // @TODO: Implement
    /*function subscriptionOwnerDoesntHaveEnoughFunds(bytes32 _subscription)
        public
        returns (bool _cancelled);*/
}