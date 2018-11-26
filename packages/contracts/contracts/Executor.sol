pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/token/WETH.sol";
import "./base/math/SafeMath.sol";

import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";

import "./interfaces/BillableInterface.sol";
import "./interfaces/ApprovedRegistryInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    using SafeMath for uint256;

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    ApprovedRegistryInterface public approvedRegistry;

    uint256 public maximumIntervalDivisor; // Latest to claim a payment or cancel.

    bool private paused;

    event SubscriptionActivated(
        address indexed contractAddress,
        bytes32 indexed paymentIdentifier,
        address indexed tokenAddress,
        uint256 dueDate,
        uint256 amount,
        uint256 fee
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
        address indexed claimant,
        uint256 indexed amount
    );

    event Paused(address account);
    event Unpaused(address account);

    /**
      * MODIFIERS
    */

    /**
      * @dev Modifier to make a function callable only when the contract is not paused.
    */
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    /**
      * @dev Modifier to make a function callable only when the contract is paused.
    */
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }

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
        paused = false;
    }

    /** @dev Set the maximum time for a subscription to go on unprocessed or to cancel afterwards.
      *      Expressed as a divisor of the interval.
      * @param _divisor is the divisor (eg 30 days / 7 = ~4).
    */
    function setMaximumIntervalDivisor(uint256 _divisor) public onlyOwner {
        // @TODO: Add tests for this.
        maximumIntervalDivisor = _divisor;
    }

    /**
      * @dev called by the owner to pause, triggers stopped state
    */
    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Paused(msg.sender);
    }

    /**
      * @dev called by the owner to unpause, returns to normal state
    */
    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }

    /** @dev Check if the contract is paused
      * @return true if the contract is paused, false otherwise.
    */
    function isPaused()
        public 
        view 
        returns (bool) 
    {
        return paused;
    }

    /** @dev Active a subscription once it's been created (make the first payment) paid from wrapped Ether.
      * @param _paymentContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function activateSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
        whenNotPaused
        returns (bool success)
    {

        // Initiate an instance of the BillableInterface subscription
        BillableInterface subscription = BillableInterface(_paymentContract);

        // Check if the subscription is valid
        require(approvedRegistry.isContractAuthorised(_paymentContract), "Unauthorised contract");
        require(subscription.getPaymentStatus(_paymentIdentifier) == 0, "Invalid subscription");

        // Get the defaults of the subscription
        ERC20 transactingToken = ERC20(subscription.getPaymentTokenAddress(_paymentIdentifier));
        uint256 subscriptionInterval = subscription.getPaymentInterval(_paymentIdentifier);
        uint256 amountDue = subscription.getAmountDueFromPayment(_paymentIdentifier);
        uint256 fee = subscription.getPaymentFee(_paymentIdentifier);
        (address consumer, address business) = subscription.getPaymentFromToAddresses(_paymentIdentifier);

        // @TODO: Add tests for this whole pathway
        (
            bool paymentSuccess, 
            bool finalPayment
        ) = attemptProcessingWithSuccessAndLastPaymentCallback(
            _paymentContract, 
            _paymentIdentifier, 
            address(transactingToken), 
            msg.sender, 
            currentTimestamp().add(subscriptionInterval), 
            amountDue, 
            fee,
            true
        );

        require(paymentSuccess, "The payment should be successfully executed");

        // If it was the final payment, mark it as completed and finish execution
        if (finalPayment) {
            emit SubscriptionCompleted(
                _paymentIdentifier,
                msg.sender,
                amountDue
            );

            return;
        }

        // Create a new record in the payments registry
        paymentRegistry.createNewPayment(
            _paymentIdentifier, // Subscription identifier
            address(transactingToken), // Token address
            currentTimestamp().add(subscriptionInterval), // Next due date
            amountDue, // Amount due
            fee // Fee
        );

        // Emit the appropriate event to show subscription has been activated
        emit SubscriptionActivated(
            _paymentContract,
            _paymentIdentifier,
            address(transactingToken),
            currentTimestamp().add(subscriptionInterval),
            amountDue,
            fee
        );

    }

    /** @dev Collect the payment due from the subscriber.
      * @param _paymentContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function processSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
        whenNotPaused
    {

        BillableInterface subscription = BillableInterface(_paymentContract);

        // Get the current payment registry object (if it doesn't exist execution will eventually fail)
        (
            address tokenAddress,
            uint256 dueDate,
            uint256 amount,
            uint256 fee,
            uint256 lastPaymentDate,
            address claimant,
            ,
            uint256 staked
        ) = paymentRegistry.updatePaymentInformation(
            _paymentIdentifier, 
            subscription.getAmountDueFromPayment(_paymentIdentifier), 
            subscription.getPaymentFee(_paymentIdentifier)
        );

        // Ensure it's a fresh subscription or only the claimant
        require(claimant == 0 || claimant == msg.sender, "There's already a claimant for this subscription");

        // Make sure it's actually due
        require(currentTimestamp() >= dueDate, "The due date has already passed");

        // Make sure it isn't too late to process
        uint256 interval = (dueDate - lastPaymentDate);
        require(currentTimestamp() < dueDate.add(interval.div(maximumIntervalDivisor)), "The subscription has already passed the processing period");

        if (attemptProcessingWithSuccessCallback(
            _paymentContract, _paymentIdentifier, tokenAddress, msg.sender, dueDate, amount, fee, false
        ) == false) {
            processingFailed(_paymentContract, _paymentIdentifier, tokenAddress, msg.sender, staked);
            return;
        }

        paymentRegistry.claimPayment(
            _paymentIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            dueDate.add(interval), // Next payment due date
            0
        );

        emit SubscriptionProcessed(
            _paymentIdentifier,
            msg.sender,
            dueDate.add(interval),
            0
        );
    }

     /** @dev Catch another service node who didn't process their payment on time.
      * @param _paymentContract is the contract where the details exist (adheres to Collectible contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function catchLateSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
        whenNotPaused
    {
        // Get the payment object
        (
            address tokenAddress,
            uint256 dueDate,
            uint256 amount,
            uint256 fee,
            uint256 lastPaymentDate,
            address claimant,
            uint256 executionPeriod,
            uint256 staked
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        // First make sure it's past the due date and execution period
        require(currentTimestamp() > dueDate.add(executionPeriod), "The execution period has not passed");

        // Ensure the original claimant can't call this function
        require(claimant != 0, "There must be a claimant in the first place");
        require(msg.sender != claimant, "The claimant cannot call catch late on himself");

        // Make the payment
        bool didProcess = attemptProcessingWithSuccessCallback(
            _paymentContract, _paymentIdentifier, tokenAddress, msg.sender, dueDate, amount, fee, false
        );

        // Slash the tokens and give them to this caller = $$$
        stakeContract.transferStake(
            claimant,
            tokenAddress,
            staked,
            msg.sender
        );

        if (didProcess == false) {
            // Cancel the subscription
            processingFailed(_paymentContract, _paymentIdentifier, tokenAddress, msg.sender, staked);
        } else {
            // Transfer claimant
            paymentRegistry.transferClaimant(
                _paymentIdentifier,
                msg.sender,
                dueDate.add(dueDate).sub(lastPaymentDate)
            );
        }

        // Emit an event to say a late payment was caught and processed
        emit SubscriptionLatePaymentCaught(
            _paymentIdentifier,
            claimant,
            msg.sender,
            staked
        );
    }

        /** @dev Release the payment/responsibility of a service node
      * @param _paymentContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _paymentIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function releaseSubscription(
        address _paymentContract,
        bytes32 _paymentIdentifier
    )
        public
        whenNotPaused
    {
        require(_paymentIdentifier > 0, "There must be a valid subscription identifier");

        // Get the payment registry information
        (
            address tokenAddress,
            uint256 dueDate,
            ,
            ,
            uint256 lastPaymentDate,
            address claimant,
            uint256 executionPeriod,
            uint256 staked
        ) = paymentRegistry.getPaymentInformation(_paymentIdentifier);

        // Check that it belongs to the rightful claimant/service node
        // This also means we're not talking about a first time payment
        require(claimant == msg.sender, "Must be the original claimant");

        // Ensure it is still active
        require(BillableInterface(_paymentContract).getPaymentStatus(_paymentIdentifier) == 1, "The subscription must be valid");

        // Make sure we're within the cancellation window
        uint256 minimumDate = lastPaymentDate.add(executionPeriod);
        uint256 interval = dueDate.sub(lastPaymentDate);
        uint256 maximumDate = minimumDate.add(interval.div(maximumIntervalDivisor));

        require(
            currentTimestamp() >= minimumDate && // Must be past last payment date and the execution period
            currentTimestamp() < maximumDate,  // Can't be past the cancellation period
            "The time period must not have passed"
        );

        // Call the remove claim on payments registry
        paymentRegistry.removeClaimant(
            _paymentIdentifier,
            msg.sender
        );

        // Unstake tokens
        stakeContract.unlockTokens(
            msg.sender,
            tokenAddress,
            staked
        );

        // Emit the correct event
        emit SubscriptionReleased(_paymentIdentifier, msg.sender, dueDate);

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
        (uint256 gasCost, uint256 gasPrice) = BillableInterface(_contractAddress).getGasForExecution(_paymentIdentifier, 0);
        uint256 rate = approvedRegistry.getRateFor(_tokenAddress);
        
        uint256 gasUsed = gasCost.mul(gasPrice.div(10**9));
        uint256 standardCost = (uint256(10**18).div(rate)).mul(10**9).mul(gasUsed);

        return standardCost;
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

    function attemptProcessingWithSuccessCallback(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint256 _newLastPaymentDate,
        uint256 _amount,
        uint256 _fee,
        bool _firstPayment
    )
        private
        returns (bool success)
    {
        (bool result, ) = attemptProcessingWithSuccessAndLastPaymentCallback(
            _paymentContract,
            _paymentIdentifier,
            _tokenAddress,
            _serviceNode,
            _newLastPaymentDate,
            _amount,
            _fee,
            _firstPayment
        );

        return (result);
        
    }

    function attemptProcessingWithSuccessAndLastPaymentCallback(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint256 _newLastPaymentDate,
        uint256 _amount,
        uint256 _fee,
        bool _firstPayment
    )
        private
        returns (bool success, bool finalPayment)
    {
       
        // Anyone who's processing a subscription should meet these guidelines
        require(
            _firstPayment == true ||
            stakeContract.getAvailableStake(msg.sender, _tokenAddress) >= 1, "At least one token is required to process subscriptions"
        );

        // Execute the actual payment
        bool paymentResult = address(this).call(
            bytes4(
                keccak256(
                    "attemptProcessing(address,bytes32,address,address,uint256,uint256,uint256)"
                )
            ), _paymentContract,
                _paymentIdentifier,
                _tokenAddress,
                _serviceNode,
                _newLastPaymentDate,
                _amount,
                _fee
        );

        // Update the last payment date in the volume subscription contract
        // If this reverts, that means the payment isn't ready
        BillableInterface subscription = BillableInterface(_paymentContract);
        (bool settingLastPaymentResult, bool finalPaymentResult) = subscription.setLastestPaymentDate(_newLastPaymentDate, _paymentIdentifier);

        // @TODO: Add tests for this down the line
        if (_firstPayment == false) {
            require(finalPaymentResult == false, "An existing payment should never be marked as the final payment. Only reserved for scheduled/first time payments.");
        }

        // The set last payment result and last payment result both have to be true.
        // The reason why we don't put a require is because setLastestPaymentDate might call an external contract
        // and we don't want a failure to stop a node from processing a payment.
        return (paymentResult && settingLastPaymentResult, finalPaymentResult);
        
    }

    function attemptProcessing(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint256 _newLastPaymentDate,
        uint256 _amount,
        uint256 _fee
    )
        external
    {
        // Essentially it's a private function without the private modifier so that the
        // .call() function can be used.

        require(msg.sender == address(this), "Function can only be called by this contract");

        BillableInterface subscription = BillableInterface(_paymentContract);

        (address consumer, address business) = subscription.getPaymentFromToAddresses(_paymentIdentifier);

        uint256 validSubscription = subscription.getPaymentStatus(_paymentIdentifier);

        require(validSubscription != 2, "Subscription must be valid");

        if (_serviceNode == consumer) {
            makePayment(ERC20(_tokenAddress), consumer, business, _amount);
            return;
        }

        // @TODO: Make tests for gas cost subtraction
        uint256 pricedGas = getPricedGas(_paymentContract, _paymentIdentifier, _tokenAddress);
        makePayment(ERC20(_tokenAddress), consumer, business, _amount.sub(_fee).sub(pricedGas));
        makePayment(ERC20(_tokenAddress), consumer, _serviceNode, _fee.add(pricedGas));
    }

    function makePayment(
        ERC20 _transactingToken,
        address _from,
        address _to,
        uint256 _amount
    )
        private
        returns (bool)
    {
        // Get the businesses balance before the transaction
        uint256 balanceOfBusinessBeforeTransfer = _transactingToken.balanceOf(_to);

        // Check if the user has enough funds
        require(_transactingToken.balanceOf(_from) >= _amount, "The user doesn't have enough tokens");

        // Send currency to the destination business
        transferProxy.transferFrom(address(_transactingToken), _from, _to, _amount);

        // Check the business actually received the funds by checking the difference
        require((_transactingToken.balanceOf(_to) - balanceOfBusinessBeforeTransfer) == _amount, "Before and after balances don't match up");
    }

    function processingFailed(
        address _paymentContract,
        bytes32 _paymentIdentifier,
        address _tokenAddress,
        address _claimant,
        uint256 _staked
    )
        private
    {
        // Cancel if it hasn't already
        BillableInterface(_paymentContract).cancelPayment(_paymentIdentifier);

        // Refund the gas to the service node by freeing up storage
        paymentRegistry.deletePayment(_paymentIdentifier);

        // Unstake tokens
        stakeContract.unlockTokens(
            _claimant,
            _tokenAddress,
            _staked
        );

        emit SubscriptionCancelled(_paymentContract, _paymentIdentifier);
    }

}