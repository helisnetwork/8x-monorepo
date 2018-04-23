pragma solidity ^0.4.21;

import "./base/ownership/Ownable.sol";

contract Collectable is Ownable {

    function getBalanceAndAmountDueFromSubscription(bytes32 _subscription) 
        public
        returns (uint _balance, uint _amount);

}