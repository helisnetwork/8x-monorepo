pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";

import "./VolumeSubscription.sol";
import "./Executor.sol";

/** @title Proxy contract to perform basic actions for users and businesses */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract ActionProxy {

    enum State {
        active,
        processing,
        cancelled
    }

    /** @dev A first time 8x user will need to give allowance to the contract.
      * @param _subscriptionContract is the address of the contract.
      * @param _subscriptionIdentifier is the identifier of the subscription.
    */
    function newAddress(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
    {

    }

    /** @dev An existing 8x user subscribing to a new subscription.
      * @param _subscriptionContract is the address of the contract.
      * @param _subscriptionIdentifier is the identifier of the subscription.
    */
    function existingAddress(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
    {

    }

    /** @dev Check the exact status of a subscription.
      * @param _subscriptionContract is the address of the contract.
      * @param _subscriptionIdentifier is the identifier of the subscription.
    */
    function returnState(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        view
        returns (State, uint timeLeft)
    {

    }

}