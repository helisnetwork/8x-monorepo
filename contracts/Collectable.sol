pragma solidity ^0.4.21;

import "./Authorizable.sol";

contract Collectable is Authorizable {

    function isValidSubscription(bytes32 _subscription) 
        view
        public
        returns (bool _success);

    function getSubscriptionTokenAddress(bytes32 _subscription)
        view
        public
        returns (address _address);

    function getSubscriptionFromToAddresses(bytes32 _subscription)
        view
        public
        returns (address _from, address _to);

    function getSubscriptionOwnerBalance(bytes32 _subscription)
        view
        public
        returns (uint _balance);

    function getAmountDueFromSubscription(bytes32 _subscription) 
        view
        public
        returns (uint _amount);
    
    function getSubscriptionFee(bytes32 _subscription)
        view
        public
        returns (uint _fee);

    function terminateSubscriptionDueToInsufficientFunds(bytes32 _subscription) onlyAuthorized public;

}