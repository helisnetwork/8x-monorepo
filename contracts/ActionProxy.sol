pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";

import "./VolumeSubscription.sol";
import "./Executor.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract ActionProxy {

    function newAddress(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
    {

    }

    function existingAddress(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
    {

    }

}