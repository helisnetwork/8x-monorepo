pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/math/SafeMath.sol";

import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";

import "./interfaces/BillableInterface.sol";
import "./interfaces/ApprovedRegistryInterface.sol";
import "./interfaces/WrappableInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    using SafeMath for uint256;

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    ApprovedRegistryInterface public approvedRegistry;

    uint256 public maximumIntervalDivisor; // Latest to claim a payment or cancel.

    event SubscriptionActivated(
        address indexed contractAddress,
        bytes32 indexed paymentIdentifier,
        address indexed tokenAddress,
        uint256 dueDate,
        uint256 amount,
        uint256 fee,
        address claimant
    );

    event SubscriptionProcessed(
        bytes32 indexed paymentIdentifier,
        address indexed claimant,
        uint256 indexed dueDate,
        uint256 staked
    );

    event SubscriptionReleased(
        bytes32 indexed paymentIdentifier,
        address indexed releasedBy,
        uint256 indexed dueDate
    );

    event SubscriptionLatePaymentCaught(
        bytes32 indexed paymentIdentifier,
        address indexed originalClaimant,
        address indexed newClaimant,
        uint256 amountLost
    );

    event SubscriptionCancelled(
        address indexed contractAddress,
        bytes32 indexed paymentIdentifier
    );

    event SubscriptionCompleted(
        bytes32 indexed paymentIdentifier,
        address indexed claimant
    );

    /**
      * MODIFIERS
    */

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Set the addresses for the relevant contracts
      * @param _transferProxyAddress the address for the designated transfer proxy.
      * @param _stakeContractAddress the address for the stake contract.
      * @param _paymentRegistryAddress the address for the payment registry.
      * @param _approvedRegistryAddress the address for the approved registry contract.
    */
    constructor(
        address _transferProxyAddress,
        address _stakeContractAddress,
        address _paymentRegistryAddress,
        address _approvedRegistryAddress,
        uint256 _divisor
    )
        public
    {
        // @TODO: Figure out how to add tests for this
        transferProxy = TransferProxy(_transferProxyAddress);
        stakeContract = StakeContract(_stakeContractAddress);
        paymentRegistry = PaymentRegistry(_paymentRegistryAddress);
        approvedRegistry = ApprovedRegistryInterface(_approvedRegistryAddress);
        maximumIntervalDivisor = _divisor;
    }

    /** @dev Set the maximum time for a subscription to go on unprocessed or to cancel afterwards.
      *      Expressed as a divisor of the interval.
      * @param _divisor is the divisor (eg 30 days / 7 = ~4).
    */
    function setMaximumIntervalDivisor(uint256 _divisor) public onlyOwner {
        // @TODO: Add tests for this.
        maximumIntervalDivisor = _divisor;
    }

    /** @dev Active a subscription once it's been created (make the first payment) paid from wrapped Ether.
      * @param _paymentContract is the contract where the details exist(adheres to Billable contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function activateSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
    {
        require(_isPaymentStatus(_paymentContract, _paymentIdentifier, 1), "Payment must be in ready state (1)");

        // Ensure the subscription contract is a valid one
        BillableInterface subscription = BillableInterface(_paymentContract);
        require(approvedRegistry.isContractAuthorised(_paymentContract), "Only authorised contracts can transact");

        var (paymentSuccess, finalPayment) = _callAttemptProcessing(_paymentContract, _paymentIdentifier, true);
        var (from, to) = subscription.getPaymentFromToAddresses(_paymentIdentifier);

        require(paymentSuccess == true, "The payment should be able to execute successfully");

        if (finalPayment == true) {
            emit SubscriptionCompleted(
                _paymentIdentifier,
                msg.sender
            );

            return;
        }

        _activatePayment(_paymentContract, _paymentIdentifier, (from != msg.sender && to != msg.sender));
    }

    function _activatePayment(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        bool _isAServiceNode
    )
        private
    {
        BillableInterface subscription = BillableInterface(_paymentContract);

        uint256 amountDue = subscription.getAmountDueFromPayment(_paymentIdentifier);
        address tokenAddress = subscription.getPaymentTokenAddress(_paymentIdentifier);
        uint256 nextPayment = currentTimestamp().add(subscription.getPaymentInterval(_paymentIdentifier));
        uint256 fee = subscription.getPaymentFee(_paymentIdentifier);

        // Create a new record in the payments registry
        paymentRegistry.createNewPayment(
            _paymentIdentifier, // Subscription identifier
            tokenAddress, // Token address
            nextPayment, // Next due date
            amountDue, // Amount due
            fee // Fee
        );

        // If someone else activates the subscription then they become the claimant
        if (_isAServiceNode == true) {
            paymentRegistry.claimPayment(
                _paymentIdentifier, // Identifier of subscription
                msg.sender, // The claimant
                nextPayment, // Next payment due date
                0
            );

            // This will notify service nodes that there's already a claimant
            emit SubscriptionActivated(
                _paymentContract,
                _paymentIdentifier,
                tokenAddress,
                nextPayment,
                amountDue,
                fee,
                msg.sender
            );

        }

        // This will notify service nodes that this is up for grabs
        emit SubscriptionActivated(
            _paymentContract,
            _paymentIdentifier,
            tokenAddress,
            nextPayment,
            amountDue,
            fee,
            0
        );

    }

    /** @dev Collect the payment due from the subscriber.
      * @param _paymentContract is the contract where the details exist(adheres to Billable contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function processSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
    {
        // Initiate an instance of the BillableInterface subscription
        BillableInterface subscription = BillableInterface(_paymentContract);
        uint256 amountDue = subscription.getAmountDueFromPayment(_paymentIdentifier);
        uint256 fee = subscription.getPaymentFee(_paymentIdentifier);

        // Get the current payment registry object (if it doesn't exist execution will eventually fail)
        var (dueDate, lastPaymentDate, claimant) = paymentRegistry.updatePaymentInformation(
            _paymentIdentifier, 
            amountDue, 
            fee
        );

        // Ensure it's a fresh subscription or only the claimant
        require(claimant == address(0) || claimant == msg.sender, "Cannot process someone else's payment");

        // Make sure it isn't too late to process and it's the right time
        require(currentTimestamp() < dueDate.add(dueDate.sub(lastPaymentDate).div(maximumIntervalDivisor)), "Must not be greater than the due date + the interval/divisor");
        require(currentTimestamp() >= dueDate, "Must be past the due date");
        
        _processPayment(_paymentContract, _paymentIdentifier);
    }

    function _processPayment(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        private
    {

        if (_callAttemptProcessingSimple(_paymentContract, _paymentIdentifier, false) == false) {
            _processingFailed(_paymentContract, _paymentIdentifier);
            return;
        }

        uint256 nextPaymentDate = getNextPaymentDate(_paymentContract, _paymentIdentifier);

        paymentRegistry.claimPayment(
            _paymentIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            nextPaymentDate, // Next payment due date
            0
        );

        emit SubscriptionProcessed(
            _paymentIdentifier,
            msg.sender,
            nextPaymentDate,
            0
        );

    }

     /** @dev Catch another service node who didn't process their payment on time.
      * @param _paymentContract is the contract where the details exist (adheres to Billable contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function catchLateSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
    {
        require(_isPaymentStatus(_paymentContract, _paymentIdentifier, 2), "Payment must be in active statement (2)");

        // Get the payment object
        var (
            tokenAddress,
            dueDate,
            ,
            ,
            ,
            claimant,
            executionPeriod,
            staked
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        // First make sure it's past the due date and execution period
        require(currentTimestamp() > dueDate.add(executionPeriod), "The execution period has not passed");

        // Ensure the original claimant can't call this function
        require(claimant != 0, "There must be a claimant in the first place");
        require(msg.sender != claimant, "The claimant cannot call catch late on himself");

        // Slash the tokens and give them to this caller = $$$
        stakeContract.transferStake(
            claimant,
            tokenAddress,
            staked,
            msg.sender
        );

        if (_callAttemptProcessingSimple(_paymentContract, _paymentIdentifier, false) == false) {
            _processingFailed(_paymentContract, _paymentIdentifier);
        } else {
            // Transfer claimant
            paymentRegistry.transferClaimant(
                _paymentIdentifier,
                msg.sender
            );
        }

        // an event to say a late payment was caught and processed
        emit SubscriptionLatePaymentCaught(
            _paymentIdentifier,
            claimant,
            msg.sender,
            staked
        );
    }

    /** @dev Release the payment/responsibility of a service node
      * @param _paymentContract is the contract where the details exist(adheres to Billable contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function releaseSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
    {
        require(_paymentIdentifier > 0, "There must be a valid subscription identifier");

        // Active or cancelled subscription
        _isPaymentStatusEither(_paymentContract, _paymentIdentifier, 2, 3);
        
        var (
            tokenAddress,
            dueDate,
            ,
            ,
            lastPaymentDate,
            claimant,
            executionPeriod,
            staked
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        // Check that it belongs to the rightful claimant/service node
        // This also means we're not talking about a first time payment
        require(claimant == msg.sender, "Must be the original claimant");

        // Make sure we're within the cancellation window
        uint256 minimumDate = lastPaymentDate.add(executionPeriod);
        uint256 interval = dueDate.sub(lastPaymentDate);
        uint256 maximumDate = minimumDate.add(interval.div(maximumIntervalDivisor));

        // Unstake tokens
        stakeContract.unlockTokens(
            msg.sender,
            tokenAddress,
            staked
        );

        // If the payment is cancelled the node should be able to withdraw their stake at any time
        require((currentTimestamp() >= minimumDate && currentTimestamp() < maximumDate) || _isPaymentStatus(_paymentContract, _paymentIdentifier, 3), "Must be within the release window");

        _releaseSubscription(_paymentIdentifier, minimumDate, maximumDate, dueDate);

    }

    function _releaseSubscription(
        bytes32 _paymentIdentifier,
        uint256 _minimumDate,
        uint256 _maximumDate,
        uint256 _dueDate
    )
        private
    {
        // Call the remove claim on payments registry
        paymentRegistry.removeClaimant(
            _paymentIdentifier,
            msg.sender
        );

        // the correct event
        emit SubscriptionReleased(_paymentIdentifier, msg.sender, _dueDate);
    }

    function getPricedGas(
        address _contractAddress,
        bytes32 _paymentIdentifier,
        address _tokenAddress
    )
        public
        view
        returns (uint256)
    {
        var (gasCost, gasPrice) = BillableInterface(_contractAddress).getGasForExecution(_paymentIdentifier, 0);

        uint256 rate = approvedRegistry.getRateFor(_tokenAddress);
        uint256 gasUsed = gasCost.mul(gasPrice.div(10**9));
        uint256 standardCost = (uint256(10**18).div(rate)).mul(10**9).mul(gasUsed);

        return standardCost;
    }

    /** @dev Calculate the next payment date for a subscription.
      * @param _paymentContract is the contract where the details exist(adheres to Billable contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function getNextPaymentDate(address _paymentContract, bytes32 _paymentIdentifier) public returns (uint256) {
        var (
            ,
            dueDate,
            ,
            ,
            lastPaymentDate,
            ,
            ,
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        uint256 paymentRegistryStoredDate = dueDate.add(dueDate).sub(lastPaymentDate);

        if (paymentRegistryStoredDate == 0) {
            uint256 interval = BillableInterface(_paymentContract).getPaymentInterval(_paymentIdentifier);
            return currentTimestamp() + interval;
        }

        return paymentRegistryStoredDate;
    }

    /** @dev Get the last time a payment was made.
      * @param _paymentContract is the contract where the details exist(adheres to Billable contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function getLastPaymentDate(address _paymentContract, bytes32 _paymentIdentifier) public returns (uint256) {
        var (
            ,
            dueDate,
            ,
            ,
            ,
            ,
            ,
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        if (dueDate == 0) {
            return currentTimestamp();
        }

        return dueDate;
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
        return block.timestamp;
    }

    /**
      * PRIVATE FUNCTION
    */

    function _callAttemptProcessingSimple(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        bool _firstPayment
    )
        private
        returns (bool success)
    {
        var (_success, ) = _callAttemptProcessing(
            _paymentContract,
            _paymentIdentifier,
            _firstPayment
        );

        return _success;
    }

    function _callAttemptProcessing(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        bool _firstPayment
    )
        private
        returns (bool success, bool finalPayment)
    {
        address tokenAddress = BillableInterface(_paymentContract).getPaymentTokenAddress(_paymentIdentifier);
       
        bool valid = _ensureValidRequirements(_paymentContract, _paymentIdentifier, tokenAddress, _firstPayment);

        _attemptProcessing(_paymentContract, _paymentIdentifier, tokenAddress, msg.sender);

        var (couldSetLastDate, _finalPayment) = _setNextPaymentDateResult(_paymentContract, _paymentIdentifier, _firstPayment);

        return (valid && couldSetLastDate, _finalPayment);
        
        // Execute the actual payment
        // @TODO: TEMP IN ORDER TO WORK FOR AION
        // bool paymentResult = address(this).call(
        //     bytes4(
        //         blake2b256(
        //             "_attemptProcessing(address,bytes32,address,address)"
        //         )
        //     ), _paymentContract,
        //         _paymentIdentifier,
        //         _tokenAddress,
        //         _serviceNode
        //     );
    }

    function _ensureValidRequirements(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        bool _firstPayment
    )
        private
        returns (bool)
    {
        // @TODO: Add tests
        var (from, to) = BillableInterface(_paymentContract).getPaymentFromToAddresses(_paymentIdentifier);
        require(msg.sender == from || msg.sender == to || stakeContract.getAvailableStake(msg.sender, _tokenAddress) >= 1, "Must have the correct stake requirements or be the first payment or be the owner");
        return _isPaymentStatusEither(_paymentContract, _paymentIdentifier, 1, 2);
    }

    function _setNextPaymentDateResult(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        bool _firstPayment
    )
        private
        returns (bool settingLastPaymentResult, bool finalPaymentResult)
    {
        // Update the last payment date in the volume subscription contract
        // If this reverts, that means the payment isn't ready
        uint256 lastPaymentDateToSet = getLastPaymentDate(_paymentContract, _paymentIdentifier);
        var (_settingLastPaymentResult, _finalPaymentResult) = BillableInterface(_paymentContract).setLastestPaymentDate(lastPaymentDateToSet, _paymentIdentifier);

        // @TODO: Add tests for this down the line
        if (_firstPayment == false) {
            require(_finalPaymentResult == false, "If its not the final payment, it should not be the final payment");
        }

        // The set last payment result and last payment result both have to be true.
        // The reason why we don't put a require is because setLastestPaymentDate might call an external contract
        // and we don't want a failure to stop a node from processing a payment.
        return (_settingLastPaymentResult, _finalPaymentResult);
    }
   
    function _attemptProcessing(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        address _serviceNode
    )
        private
    {
        // Essentially it's a private function without the private modifier so that the
        // .call() function can be used.

        // @TODO: TEMP FIX FOR AION ONLY!
        //require(msg.sender == address(this));

        var (from, to) = BillableInterface(_paymentContract).getPaymentFromToAddresses(_paymentIdentifier);

        uint256 fee = BillableInterface(_paymentContract).getPaymentFee(_paymentIdentifier);
        uint256 amount = BillableInterface(_paymentContract).getAmountDueFromPayment(_paymentIdentifier); 

        if (_serviceNode == from || _serviceNode == to) {
            _makePayment(_tokenAddress, from, to, amount);
            return;
        }

        uint256 pricedGas = getPricedGas(_paymentContract, _paymentIdentifier, _tokenAddress);
        _attemptProcessingServiceNode(_tokenAddress, from, to, _serviceNode, amount, fee, pricedGas);
    }

    function _attemptProcessingServiceNode(
        address _tokenAddress,
        address _from,
        address _to,
        address _serviceNode,
        uint256 _amount,
        uint256 _fee,
        uint256 _pricedGas
    )
        private
    {
        _makePayment(_tokenAddress, _from, _to, _amount.sub(_fee).sub(_pricedGas));
        _makePayment(_tokenAddress, _from, _serviceNode, _fee.add(_pricedGas));
    }

    function _makePayment(
        address _tokenAddress,
        address _from,
        address _to,
        uint256 _amount
    )
        private
        returns (bool)
    {
        // Instantiate the token
        ERC20 transactingToken = ERC20(_tokenAddress);

        // Get the businesses balance before the transaction
        uint256 balanceOfBusinessBeforeTransfer = transactingToken.balanceOf(_to);

        // Check if the user has enough funds
        require(transactingToken.balanceOf(_from) >= _amount, "The user must have enough funds");

        // Send currency to the destination business
        transferProxy.transferFrom(address(transactingToken), _from, _to, _amount);

        // Check the business actually received the funds by checking the difference
        require((transactingToken.balanceOf(_to) - balanceOfBusinessBeforeTransfer) == _amount, "They should have received the difference");

        // Unwrap the payment if it is wrapped
        if (approvedRegistry.isTokenWrapped(_tokenAddress) == true) {
            WrappableInterface(_tokenAddress).withdrawOnBehalfOf(_amount, _to);
        }
    }

    function _processingFailed(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        private
    {
        // Cancel if it hasn't already
        BillableInterface(_paymentContract).cancelPayment(_paymentIdentifier);

        var (
            tokenAddress,
            ,
            ,
            ,
            ,
            claimant,
            ,
            staked
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        // Refund the gas to the service node by freeing up storage
        paymentRegistry.deletePayment(_paymentIdentifier);

        // Unstake tokens
        stakeContract.unlockTokens(
            claimant,
            tokenAddress,
            staked
        );

        emit SubscriptionCancelled(_paymentContract, _paymentIdentifier);
    }

    function _isPaymentStatus(address _paymentContract, bytes32 _paymentIdentifier, uint256 one) private returns (bool) {
        uint256 status = BillableInterface(_paymentContract).getPaymentStatus(_paymentIdentifier);
        return (status == one);
    }

    function _isPaymentStatusEither(address _paymentContract, bytes32 _paymentIdentifier, uint256 one, uint256 two) private returns (bool) {
        uint256 status = BillableInterface(_paymentContract).getPaymentStatus(_paymentIdentifier);
        return (status == one || status == two);
    }

}