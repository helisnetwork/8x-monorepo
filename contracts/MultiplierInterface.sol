pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";

/** @title Interface for a contract which determines how many tokens are needed */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MultiplierInterface is Ownable {

    /** @dev Get the amount of tokens required for a subscription.
      * @param _startDate is the date when the subscription was due.
      * @param _claimDate is the date when the person will claim.
      * @param _maximumClaimDate what's the latest we need it processed by.
      * @param _totalUnlocked is the amount of tokens unstaked for that currency.
      * @return the amount of tokens required.
    */
    function getMultiplier(
        uint _startDate,
        uint _claimDate,
        uint _maximumClaimDate,
        uint _totalUnlocked
    )
        public
        constant
        returns (uint);

}