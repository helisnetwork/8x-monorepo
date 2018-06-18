pragma solidity ^0.4.21;

import "../TransactionRegistry.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract MockTransactionRegistry is TransactionRegistry {

    uint public currentTime = block.timestamp;

    /** @dev A mock of the current timsstamp
      *
    */

    function currentTimestamp()
        internal
        view
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