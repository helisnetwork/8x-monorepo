pragma solidity 0.4.24;

import "./interfaces/RequirementsInterface.sol";

/** @title Contract which determines how many tokens are needed for a subscription */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Requirements is RequirementsInterface {

    function getStake(
        uint _gini,
        uint _divideBy,
        uint _startDate,
        uint _claimDate,
        uint _maximumClaimDate,
        uint _totalUnlocked
    )
        public
        view
        returns (uint)
    {
        return 1;
    }

}