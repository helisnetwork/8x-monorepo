pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";

/** @title Interface for a contract which determines how many tokens are needed */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MultiplierInterface is Ownable {

    /** @dev Get the amount of tokens required for a subscription
      * @param dueDate is the date when the subscription was due
      * @param claimDate is the date when the person will claim
      * @param amount is the subscription amount
      * @param totalUnstaked is the amount of tokens unstaked for that currency.
      * @param maximumClaimDate what's the maximum amount of time for it to process.
      * @return the amount of tokens required.
    */
    function getRequiredStake(
        uint _dueDate,
        uint _claimDate,
        uint _maximumClaimDate,
        uint _amount,
        uint _totalUnstaked
    )
        public
        returns (uint);

}