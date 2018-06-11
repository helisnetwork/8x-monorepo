pragma solidity ^0.4.18;

import "./Authorizable.sol";

/** @title Transaction Registry - Stores a list of all the currently pending transactions */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract PaymentsRegistry is Authorizable {

    struct Payment {
        address subscriptionContract;

        uint dueDate;
        uint lastPaymentDate;
        uint stake;

        address claimant;
        uint executionPeriod;
    }

    mapping (bytes32 => Payment) public payments;

    uint public multiplier;

    event PaymentCreated(bytes32 _subscriptionIdentifer);
    event PaymentProcessed(bytes32 _subscriptionIdentifer);
    event PaymentClaimantRemoved(bytes32 _subscriptionIdentifer);
    event PaymentCancelled(bytes32 _subscriptionIdentifer);

    /**
      * Public functions
    */

    /** @dev Set a multiplier for how many tokens you need in order to claim proportional to the payments.
      * @param _amount is the multiplier that would like to be set.
    */
    function setMultiplier(uint _amount) public onlyOwner {

        // @TODO: Implementation

    }

    /** @dev Create a new payment object when a user intially subscribes to a plan.
      * @param _subscriptionContract is the contract where the details exist (adheres to Collectable contract interface).
      * @param _subscriptionIdentifier is the identifier o f that customer's subscription with it's relevant details.
      * @param _dueDate is when the payment is meant to be paid by.
      * @param _stake is how much the processors has staked in order to have the right to process the transaction.
    */
    function createNewPayment(
        bytes32 _subscriptionIdentifier,
        address _subscriptionContract,
        uint _dueDate,
        uint _stake)

        public
        onlyAuthorized
        returns (bool success)
    {

        // @TODO: Implementation

    }

    /** @dev Process the payment
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with it's relevant details.
      * @param _dueDate is the date for the next billing cycle. This is to set by the executor.
      * @param _stake is how many 8x tokens are required to process.
    */
    function processPayment(
        bytes32 _subscriptionIdentifier,
        uint _dueDate,
        uint _stake
    )
        public
        onlyAuthorized
        returns (bool success)
    {

        // @TODO: Implementation

    }

    /** @dev Allows a claimant to cancel their responsibility to process a transaction
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with it's relevant details.
    */
    function removeClaimant(bytes32 _subscriptionIdentifier)
        public
        onlyAuthorized
        returns (bool success)
    {

        // @TODO: Implementation

    }

    /** @dev A payment was cancelled by the business or user
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with it's relevant details.
    */
    function cancelPayment(bytes32 _subscriptionIdentifier)
        public
        onlyAuthorized
        returns (bool sucess)
    {

        // @TODO: Implementation

    }

    function getPaymentInformation(bytes32 _subscriptionIdenitifer)
        public
        view
        returns (
            address subscriptionContract,
            uint dueDate,
            uint lastPaymentDate,
            uint stake,
            address claimant,
            uint executionPeriod
        )
    {

    }

}