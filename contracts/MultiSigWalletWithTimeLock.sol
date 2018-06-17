pragma solidity ^0.4.21;

import "./MultiSigWallet.sol";

/** @title Multi signature wallet with a time lock*/
/** @author Kerman Kohli - kerman@TBD.com, originally from Amir Bandeali - ami@0xproject.com */

contract MultiSigWalletWithTimeLock is MultiSigWallet {

    uint public secondsTimeLocked;

    mapping (uint => uint) public confirmationTimes;

    event ConfirmationTimeSet(uint indexed transactionId, uint confirmationTime);
    event TimeLockChange(uint secondsTimeLocked);

    /*
     * Modifiers
    */

    modifier partiallyConfirmed(uint _transactionId) {

        // @TODO: Implementation
        _;

    }

    modifier fullyConfirmed(uint _transactionId) {

        // @TODO: Implmentation
        _;

    }

    modifier timeLockPassed(uint _transactionId) {

        // @TODO: Implementation
        _;

    }

    /*
     * Public functions
    */

    /* @dev Constructor function to create multi sig wallet with the time lock.
     * @param _owners Array of all the starting owners.
     * @param _required Number of required signatures to authorize a transaction.
     * @param _secondsLocked Amount of time required to pass before executing a transaction.
    */
    function constructor(
        address[] _owners,
        uint _required,
        uint _secondsLocked
    )
        public
        // Your linter might get mad at this since there's no constructor function called MultiSigWallet.
        MultiSigWallet(_owners, _required)
    {

        // @TODO: Implementation

    }

    /* @dev Change the amount of time required to change the time lock.
     * @param _secondsLocked Set the number of seconds required to pass the time lock.
    */
    function changeTimeLock(uint _secondsLocked) public {

        // @TODO: Implementation

    }

    /* @dev Confirm a pending transaction as an owner.
     * @param _transactionId Identifier of the transaction.
    */
    function confirmTransaction(uint _transactionId) public {

        // @TODO: Implementation

    }

    /* @dev Revoke a transaction as an owner.
     * @param _transactionId Identifier of the transaction.
    */
    function revokeConfirmation(uint _transactionId) public {

      // @TODO: Implementation

    }

    /* @dev Execute the transaction itself.
     * @param _transactionId Identifier of the transaction.
    */
    function executeTransaction(uint _transactionId) public {

        // @TODO: Implementation

    }

    /*
     * Internal functions
    */

    /* @dev Set the confirmation time required for a transaction to go through.
     * @param _transactionId Identifier of the transaction.
     * @param _confirmationTime Confirmation time to set.
    */
    function setConfirmationTime(uint _transactionId, uint _confirmationTime) internal {

      // @TODO: Implementation

    }

}