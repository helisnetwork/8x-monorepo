pragma solidity 0.4.24;

import "./Authorizable.sol";
import "./base/math/SafeMath.sol";

/** @title Transaction Registry - Stores a list of pending transactions */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract PaymentRegistry is Authorizable {

    using SafeMath for uint256;

    struct Payment {
        address tokenAddress;              // 0

        uint256 dueDate;                   // 1
        uint256 amount;                    // 2
        uint256 fee;                       // 3
        uint256 lastPaymentDate;           // 4

        address claimant;                  // 5
        uint256 executionPeriod;           // 6
        uint256 staked;                    // 7
    }

    // The bytes32 key is the subscription identifier
    mapping (bytes32 => Payment) public payments;

    event PaymentCreated(bytes32 subscriptionIdentifer);
    event PaymentClaimed(bytes32 subscriptionIdentifer, address claimant);

    event PaymentClaimantRemoved(bytes32 subscriptionIdentifer, address claimant);
    event PaymentClaimantTransferred(bytes32 subscriptionIdentifer, address claimant);

    event PaymentAmountUpdated(bytes32 paymentIdentifier, uint256 newAmount, uint256 newFee, uint256 newStake);

    event PaymentCancelled(bytes32 subscriptionIdentifer);
    event PaymentDeleted(bytes32 paymentIdentifier);


    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Create a new payment object when a user initially subscribes to a plan.
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
      * @param _tokenAddress is the transacting token.
      * @param _dueDate is when the payment is meant to be paid by.
      * @param _amount is how much the processors has staked in order to have the right to process the transaction.
      * @param _fee is th service node's cut.
    */
    function createNewPayment(
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        uint256 _dueDate,
        uint256 _amount,
        uint256 _fee
    )
        public
        onlyAuthorized
        returns (bool success)
    {

        require(_paymentIdentifier != 0, "The subscription identifier cannot be empty");
        require(_tokenAddress != 0, "The token address cannot be empty");
        require(_dueDate >= currentTimestamp(), "The timestamp must be greater than now");
        require(_amount > 0, "The amount must be greater than 0");
        require(_fee > 0, "The fee must be greater than 0");

        Payment memory newPayment = Payment({
            tokenAddress: _tokenAddress,
            dueDate: _dueDate,
            amount: _amount,
            fee: _fee,
            lastPaymentDate: currentTimestamp(),
            claimant: 0,
            executionPeriod: 0,
            staked: 0
        });

        payments[_paymentIdentifier] = newPayment;

        emit PaymentCreated(_paymentIdentifier);

        return true;

    }


    /** @dev Claim the payment
      * @param _paymentIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
      * @param _claimant is the address of the account behind a service node.
      * @param _nextPayment is the date for the next payment.
    */
    function claimPayment(
        bytes32 _paymentIdentifier,
        address _claimant,
        uint256 _nextPayment,
        uint256 _staked)
        public
        onlyAuthorized
        returns (bool success)
    {
        Payment storage currentPayment = payments[_paymentIdentifier];

        require(currentTimestamp() >= currentPayment.dueDate, "The current timestamp must be greater than the due date");
        require(_nextPayment >= currentTimestamp(), "The next payment must date be greater than the current timestamp");

        if (currentPayment.claimant != 0) {
            require(currentTimestamp() <= currentPayment.dueDate.add(currentPayment.executionPeriod), "The timestamp is past the execution period");
            require(currentPayment.claimant == _claimant, "A different claimant is trying to claim a payment");
        }

        if (currentPayment.executionPeriod == 0 && currentPayment.claimant == 0) {
            currentPayment.executionPeriod = currentTimestamp().sub(currentPayment.dueDate);
        }

        uint256 oldDueDate = currentPayment.dueDate;

        currentPayment.claimant = _claimant;
        currentPayment.lastPaymentDate = oldDueDate;
        currentPayment.dueDate = _nextPayment;
        currentPayment.staked = _staked;

        emit PaymentClaimed(_paymentIdentifier, _claimant);

        return true;
    }

    /** @dev Allows a claimant to cancel their responsibility to process a
      * transaction
      * @param _paymentIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
      * @param _claimant is the service node.
    */
    function removeClaimant(
        bytes32 _paymentIdentifier,
        address _claimant
    )
        public
        onlyAuthorized
        returns (bool success)
    {
        Payment storage currentPayment = payments[_paymentIdentifier];

        currentPayment.claimant = 0;
        currentPayment.executionPeriod = 0;
        currentPayment.staked = 0;

        emit PaymentClaimantRemoved(_paymentIdentifier, _claimant);

        return true;
    }
    
    /** @dev Update the payment amount in the registry 
      * @param _paymentIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
      * @param _newAmount is how much the amount is for.
    */
    function updatePaymentInformation(
        bytes32 _paymentIdentifier,
        uint256 _newAmount,
        uint256 _newFee
    )
        public
        onlyAuthorized
        returns (
            address tokenAddress,              // 0
            uint256 dueDate,                   // 1
            uint256 amount,                    // 2
            uint256 fee,                       // 3
            uint256 lastPaymentDate,           // 4
            address claimant,                  // 5
            uint256 executionPeriod,           // 6
            uint256 staked                     // 7
        )
    { 
        
        Payment storage currentPayment = payments[_paymentIdentifier];

        if (_newAmount < currentPayment.amount) {
            uint256 divisor = currentPayment.amount.div(_newAmount);
            currentPayment.staked = currentPayment.staked.div(divisor);
        } else {
            uint256 multiplier = _newAmount.div(currentPayment.amount);
            currentPayment.staked = currentPayment.staked.mul(multiplier);
        }

        currentPayment.amount = _newAmount;
        currentPayment.fee = _newFee;

        emit PaymentAmountUpdated(_paymentIdentifier, _newAmount, _newFee, currentPayment.staked);

        return(
            currentPayment.tokenAddress,
            currentPayment.dueDate,
            currentPayment.amount,
            currentPayment.fee,
            currentPayment.lastPaymentDate,
            currentPayment.claimant,
            currentPayment.executionPeriod,
            currentPayment.staked
        );
    }

    /** @dev Allows a claimant to transfer their responsibility to process a
      * transaction
      * @param _paymentIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
      * @param _claimant is the service node.
    */
    function transferClaimant(
        bytes32 _paymentIdentifier,
        address _claimant,
        uint256 _nextPayment
    )
        public
        onlyAuthorized
        returns (bool success)
    {
        // @TODO: Write tests
        require(_nextPayment >= currentTimestamp(), "The next payment date must be a date in the future");

        Payment storage currentPayment = payments[_paymentIdentifier];

        uint256 oldDueDate = currentPayment.dueDate;

        currentPayment.executionPeriod = currentTimestamp().sub(oldDueDate);
        currentPayment.claimant = _claimant;
        currentPayment.lastPaymentDate = oldDueDate;
        currentPayment.dueDate = _nextPayment;

        emit PaymentClaimantTransferred(_paymentIdentifier, _claimant);

        return true;
    }

    /** @dev A payment was cancelled by the business or user
      * @param _paymentIdentifier is the identifier of that customer's
      * subscription with it's relevant details.
    */
    function cancelPayment(bytes32 _paymentIdentifier)
        public
        onlyAuthorized
        returns (bool sucess)
    {
        delete payments[_paymentIdentifier];

        emit PaymentCancelled(_paymentIdentifier);

        return true;
    }

    /** @dev Delete the payments registry object and refund gas
      * @param _paymentIdentifier is the identifier of that customer's
    */
    function deletePayment(bytes32 _paymentIdentifier)
        public
        onlyAuthorized
    {

        delete payments[_paymentIdentifier];
        emit PaymentDeleted(_paymentIdentifier);
    }

    /** @dev Get the infromation about a payment
      * @param _subscriptionIdenitifer is the identifier of that customer's
      * subscription with it's relevant details.
    */
    function getPaymentInformation(bytes32 _subscriptionIdenitifer)
        public
        view
        returns (
            address tokenAddress,              // 0
            uint256 dueDate,                   // 1
            uint256 amount,                    // 2
            uint256 fee,                       // 3
            uint256 lastPaymentDate,           // 4
            address claimant,                  // 5
            uint256 executionPeriod,           // 6
            uint256 staked                     // 7
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
            payment.staked
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
        returns (uint256 timetstamp)
    {
        // solhint-disable-next-line
        return block.timestamp;
    }

}