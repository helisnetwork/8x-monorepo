pragma solidity 0.4.24;

/** @title Interface for a contract which determines how many tokens are needed */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MultiplierInterface {

    /** @dev Get the amount of tokens required for a subscription
      * @param dueDate is the date when the subscription was due
      * @param claimDate is the date when the person will claim
      * @param totalUnstaked is the amount of tokens unstaked for that currency.
      * @return the amount of tokens required.
    */
    function getRequiredStake(
        uint dueDate,
        uint claimDate,
        uint totalUnstaked
    )
        public
        returns (uint);

}