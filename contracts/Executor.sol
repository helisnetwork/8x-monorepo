pragma solidity ^0.4.21;

import "./base/ownership/Ownable.sol";
import "./Collectable.sol";
import "./TransferProxy.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract Executor is Ownable {

    TransferProxy public transferProxy;

    /**
      * Modifiers
    */

    /**
      * Public functions
    */

    function setTransferProxy(address _proxyAddress)
      public
      onlyOwner
    {
        transferProxy = TransferProxy(_proxyAddress);
    }


    /** @dev Collect the payment due from the subscriber.
      * @param _subscriptionContract is the contract where the details exist (adheres to Collectable contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function collectPayment(address _subscriptionContract, bytes32 _subscriptionIdentifier)
        public
        returns (bool success)
    {

        Collectable collectableContract = Collectable(_subscriptionContract);
        require(collectableContract.isValidSubscription(_subscriptionIdentifier) == true); // Check if the subscription hasn't been cancelled

        address tokenAddress = collectableContract.getSubscriptionTokenAddress(
            );

        address from;
        address to;
        (from, to) = collectableContract.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        uint ownerBalance = collectableContract.getSubscriptionOwnerBalance(_subscriptionIdentifier);
        uint amountDue = collectableContract.getAmountDueFromSubscription(_subscriptionIdentifier);

        if (ownerBalance >= amountDue) { // Check whether the subscriber even has enough money
            uint collectorCut = amountDue / 100;
            // Pay the plan owner
            transferProxy.transferFrom(tokenAddress, from, to, amountDue - collectorCut);

            // Pay the person who called this contract
            transferProxy.transferFrom(tokenAddress, from, msg.sender, collectorCut);
            return true;
        } else { // Control flow for if they don't have enough
            collectableContract.terminateSubscriptionDueToInsufficientFunds(_subscriptionIdentifier);
            return false;
        }
        return true;
    }

}