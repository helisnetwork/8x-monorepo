pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./Collectable.sol";
import "./TransferProxy.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract Executor is Ownable {

    TransferProxy public transferProxy;

    /**
      * PUBLIC FUNCTIONS
    */
    function setTransferProxy(address _proxyAddress)
        public
        onlyOwner
    {
        transferProxy = TransferProxy(_proxyAddress);
    }

    /** @dev Collect the payment due from the subscriber.
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function collectPayment(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier)
        public
        returns (bool success)
    {
        return false;
    }

}