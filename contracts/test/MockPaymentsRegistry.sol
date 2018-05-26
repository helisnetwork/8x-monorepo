pragma solidity ^0.4.21;

import "../PaymentsRegistry.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract MockPaymentsRegistry is PaymentsRegistry {

    uint public currentTime = block.timestamp;

    /** @dev A mock of the current timsstamp
      *
    */

    function currentTimestamp() 
        internal
        returns (uint _timetstamp) 
    {
        return currentTime;
    }

    /** @dev Set the time in the contract
      *
    */
    
    function setTime(uint _time)
        public
    {
        currentTime = _time;
    }

    /** @dev Turn back the time in the contract
      *
    */
    
    function turnBackTime(uint _seconds)
        public
    {
        currentTime -= _seconds;
    }

}