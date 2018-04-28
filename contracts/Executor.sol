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
      * _subscriptionContract is the contract where the details exist (adheres to Collectable contract interface).
      * _subscriptionIdentifier is the identifier of that customer's subscription with it's relevant details.
    */
    function collectPayment(address _subscriptionContract, bytes32 _subscriptionIdentifier)
        public
        returns (bool _success)
    {

        Collectable collectableContract = Collectable(_subscriptionContract);
        require(collectableContract.isValidSubscription(_subscriptionIdentifier)); // Check if the subscription hasn't been cancelled

        address tokenAddress = collectableContract.getSubscriptionTokenAddress(_subscriptionIdentifier);

        address from;
        address to;
        (from, to) = collectableContract.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        uint ownerBalance = collectableContract.getSubscriptionOwnerBalance(_subscriptionIdentifier);
        uint amountDue = collectableContract.getAmountDueFromSubscription(_subscriptionIdentifier);

        if (ownerBalance >= amountDue) { // Check whether the subscriber even has enough money
            transferProxy.transferFrom(tokenAddress, from, to, amountDue);
            return true;
        } else { // Control flow for if they don't have enough
            collectableContract.terminateSubscriptionDueToInsufficientFunds(_subscriptionIdentifier);
            return false;
        }
    }

}