pragma solidity 0.4.24;

import "./Authorizable.sol";

/** @title Transaction Registry - Stores a list of pending transactions */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract PaymentRegistry is Authorizable {

    struct Payment {
        address tokenAddress;           // 0

        uint dueDate;                   // 1
        uint amount;                    // 2
        uint fee;                       // 3
        uint lastPaymentDate;           // 4

        address claimant;               // 5
        uint executionPeriod;           // 6
        uint stakeMultiplier;           // 7
    }

    // The bytes32 key is the subscription identifier
    mapping (bytes32 => Payment) public payments;

    event PaymentCreated(bytes32 subscriptionIdentifer);
    event PaymentClaimed(bytes32 subscriptionIdentifer, address claimant);
    event PaymentClaimantRemoved(bytes32 subscriptionIdentifer, address claimant);
    event PaymentCancelled(bytes32 subscriptionIdentifer);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Create a new payment object when a user initially subscribes to a plan.
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
      * @param _tokenAddress is the transacting token.
      * @param _dueDate is when the payment is meant to be paid by.
      * @param _amount is how much the processors has staked in order to have the right to process the transaction.
      * @param _fee is th service node's cut.
    */
    function createNewPayment(
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        uint _dueDate,
        uint _amount,
        uint _fee
    )
        public
        onlyAuthorized
        returns (bool success)
    {

        require(_subscriptionIdentifier[0] != 0);
        require(_tokenAddress != 0);
        require(_dueDate >= currentTimestamp());
        require(_amount > 0);
        require(_fee > 0);

        Payment memory newPayment = Payment({
            tokenAddress: _tokenAddress,
            dueDate: _dueDate,
            amount: _amount,
            fee: _fee,
            lastPaymentDate: 0,
            claimant: 0,
            executionPeriod: 0,
            stakeMultiplier: 0
        });

        payments[_subscriptionIdentifier] = newPayment;

        emit PaymentCreated(_subscriptionIdentifier);

        return true;

    }

    /** @dev Claim the payment
      * @param _subscriptionIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
      * @param _claimant is the address of the account behind a service node.
      * @param _nextPayment is the date for the next payment.
    */
    function claimPayment(
        bytes32 _subscriptionIdentifier,
        address _claimant,
        uint _nextPayment,
        uint _stakeMultiplier)
        public
        onlyAuthorized
        returns (bool success)
    {
        Payment storage currentPayment = payments[_subscriptionIdentifier];
        require(currentTimestamp() >= currentPayment.dueDate);
        require(_nextPayment >= currentTimestamp());
        require(_stakeMultiplier > 0);

        if (currentPayment.claimant != 0) {
            require(currentTimestamp() <= currentPayment.dueDate + currentPayment.executionPeriod);
            require(currentPayment.claimant == _claimant);
        }

        if (currentPayment.executionPeriod == 0) {
            currentPayment.executionPeriod = currentTimestamp() - currentPayment.dueDate;
        }

        currentPayment.claimant = _claimant;
        currentPayment.dueDate = _nextPayment;
        currentPayment.lastPaymentDate = currentTimestamp();
        currentPayment.stakeMultiplier = _stakeMultiplier;

        emit PaymentClaimed(_subscriptionIdentifier, _claimant);

        return true;
    }

    /** @dev Allows a claimant to cancel their responsibility to process a
      * transaction
      * @param _subscriptionIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
    */
    function removeClaimant(
        bytes32 _subscriptionIdentifier,
        address _claimant)
        public
        onlyAuthorized
        returns (bool success)
    {
        Payment storage currentPayment = payments[_subscriptionIdentifier];

        currentPayment.claimant = 0;
        currentPayment.executionPeriod = 0;
        currentPayment.stakeMultiplier = 0;

        emit PaymentClaimantRemoved(_subscriptionIdentifier, _claimant);

        return true;
    }

    /** @dev A payment was cancelled by the business or user
      * @param _subscriptionIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
    */
    function cancelPayment(bytes32 _subscriptionIdentifier)
        public
        onlyAuthorized
        returns (bool sucess)
    {
        delete payments[_subscriptionIdentifier];

        emit PaymentCancelled(_subscriptionIdentifier);

        return true;
    }

    /** @dev Get the infromation about a payment
      * @param _subscriptionIdenitifer is the identifier of that customer's
      * subscription with it's relevant details.
    */
    function getPaymentInformation(bytes32 _subscriptionIdenitifer)
        public
        view
        returns (
            address tokenAddress,           // 0
            uint dueDate,                   // 1
            uint amount,                    // 2
            uint fee,                       // 3
            uint lastPaymentDate,           // 4
            address claimant,               // 5
            uint executionPeriod,           // 6
            uint stakeMultiplier            // 7
        )
    {
        Payment memory payment = payments[_subscriptionIdenitifer];
        return(
            payment.tokenAddress,
            payment.dueDate,
            payment.amount,
            payment.fee,
            payment.lastPaymentDate,
            payment.claimant,
            payment.executionPeriod,
            payment.stakeMultiplier
        );
    }

     /**
      * INTERNAL FUNCTIONS
    */
    /** @dev Current timestamp returned via a function in order for mocks in tests
    */
    function currentTimestamp()
        internal
        view
        returns (uint timetstamp)
    {
        // solhint-disable-next-line
        return block.timestamp;
    }

}