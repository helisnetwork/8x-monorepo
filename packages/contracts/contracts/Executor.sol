pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/token/WETH.sol";

import "./Collectable.sol";
import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";

import "./interfaces/ApprovedRegistryInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    ApprovedRegistryInterface public approvedRegistry;

    uint public maximumIntervalDivisor; // Latest to claim a payment or cancel.

    bool private paused;

    event SubscriptionActivated(
        address indexed subscriptionAddress,
        bytes32 indexed subscriptionIdentifier,
        address indexed tokenAddress,
        uint dueDate,
        uint amount,
        uint fee
    );

    event SubscriptionProcessed(
        bytes32 indexed subscriptionIdentifier,
        address indexed claimant,
        uint indexed dueDate,
        uint staked
    );

    event SubscriptionReleased(
        bytes32 indexed subscriptionIdentifier,
        address indexed releasedBy,
        uint indexed dueDate
    );

    event SubscriptionLatePaymentCaught(
        bytes32 indexed subscriptionIdentifier,
        address indexed originalClaimant,
        address indexed newClaimant,
        uint amountLost
    );

    event SubscriptionCancelled(
        address indexed subscriptionAddress,
        bytes32 indexed subscriptionIdentifier
    );

    event SubscriptionCompleted(
        bytes32 indexed subscriptionIdentifier,
        address indexed claimant,
        uint indexed amount
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
        uint _divisor
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
    function setMaximumIntervalDivisor(uint _divisor) public onlyOwner {
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
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function activateSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        whenNotPaused
        returns (bool success)
    {

        // Initiate an instance of the collectable subscription
        Collectable subscription = Collectable(_subscriptionContract);

        // Check if the subscription is valid
        require(approvedRegistry.isContractAuthorised(_subscriptionContract), "Unauthorised contract");
        require(subscription.hasSubscriptionStarted(_subscriptionIdentifier) == false, "Invalid subscription");

        // Get the defaults of the subscription
        ERC20 transactingToken = ERC20(subscription.getSubscriptionTokenAddress(_subscriptionIdentifier));
        uint subscriptionInterval = subscription.getSubscriptionInterval(_subscriptionIdentifier);
        uint amountDue = subscription.getAmountDueFromSubscription(_subscriptionIdentifier);
        uint fee = subscription.getSubscriptionFee(_subscriptionIdentifier);
        (address consumer, address business) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        // Charge fee if the person who is calling this function is not the one being charged
        if (msg.sender != consumer) {
            // @TODO: Add tests for this whole pathway
            (
                bool paymentSuccess, 
                bool finalPayment
            ) = attemptProcessingWithSuccessAndLastPaymentCallback(
                _subscriptionContract, 
                _subscriptionIdentifier, 
                address(transactingToken), 
                msg.sender, 
                currentTimestamp() + subscriptionInterval, 
                amountDue, 
                fee,
                true
            );

            require(paymentSuccess);

            // If it was the final payment, mark it as completed and finish execution
            if (finalPayment) {
                emit SubscriptionCompleted(
                    _subscriptionIdentifier,
                    msg.sender,
                    amountDue
                );

                return;
            }
        } else {
            makePayment(transactingToken, consumer, business, amountDue);
        }

        // Create a new record in the payments registry
        paymentRegistry.createNewPayment(
            _subscriptionIdentifier, // Subscription identifier
            address(transactingToken), // Token address
            currentTimestamp() + subscriptionInterval, // Next due date
            amountDue, // Amount due
            fee // Fee
        );

        // Update the last payment date
        subscription.setLastPaymentDate(currentTimestamp(), _subscriptionIdentifier);

        // Emit the appropriate event to show subscription has been activated
        emit SubscriptionActivated(
            _subscriptionContract,
            _subscriptionIdentifier,
            address(transactingToken),
            currentTimestamp() + subscriptionInterval,
            amountDue,
            fee
        );

    }

    /** @dev Collect the payment due from the subscriber.
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function processSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        whenNotPaused
    {

        Collectable subscription = Collectable(_subscriptionContract);

        // Get the current payment registry object (if it doesn't exist execution will eventually fail)
        (
            address tokenAddress,
            uint dueDate,
            uint amount,
            uint fee,
            uint lastPaymentDate,
            address claimant,
            ,
            uint staked
        ) = paymentRegistry.updatePaymentInformation(
            _subscriptionIdentifier, 
            subscription.getAmountDueFromSubscription(_subscriptionIdentifier), 
            subscription.getSubscriptionFee(_subscriptionIdentifier)
        );

        // Ensure it's a fresh subscription or only the claimant
        require(claimant == 0 || claimant == msg.sender, "There's already a claimant for this subscription");

        // Make sure it's actually due
        require(currentTimestamp() >= dueDate, "The due date has already passed");

        // Make sure it isn't too late to process
        uint interval = (dueDate - lastPaymentDate);
        require(currentTimestamp() < (dueDate + (interval / maximumIntervalDivisor)), "The subscription has already passed the processing period");

        if (attemptProcessingWithSuccessCallback(
            _subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, dueDate, amount, fee, false
        ) == false) {
            processingFailed(_subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, staked);
            return;
        }

        paymentRegistry.claimPayment(
            _subscriptionIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            dueDate + interval, // Next payment due date
            0
        );

        emit SubscriptionProcessed(
            _subscriptionIdentifier,
            msg.sender,
            dueDate + interval,
            0
        );
    }

     /** @dev Catch another service node who didn't process their payment on time.
      * @param _subscriptionContract is the contract where the details exist (adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function catchLateSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        whenNotPaused
    {
        // Get the payment object
        (
            address tokenAddress,
            uint dueDate,
            uint amount,
            uint fee,
            uint lastPaymentDate,
            address claimant,
            uint executionPeriod,
            uint staked
        ) = paymentRegistry.getPaymentInformation(_subscriptionIdentifier);

        // First make sure it's past the due date and execution period
        require(currentTimestamp() > (dueDate + executionPeriod), "The execution period has not passed");

        // Ensure the original claimant can't call this function
        require(claimant != 0, "There must be a claimant in the first place");
        require(msg.sender != claimant, "The claimant cannot call catch late on himself");

        // Make the payment
        bool didProcess = attemptProcessingWithSuccessCallback(
            _subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, dueDate, amount, fee, false
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
            processingFailed(_subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, staked);
        } else {
            // Transfer claimant
            paymentRegistry.transferClaimant(
                _subscriptionIdentifier,
                msg.sender,
                dueDate + (dueDate - lastPaymentDate)
            );
        }

        // Emit an event to say a late payment was caught and processed
        emit SubscriptionLatePaymentCaught(
            _subscriptionIdentifier,
            claimant,
            msg.sender,
            staked
        );
    }

        /** @dev Release the payment/responsibility of a service node
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function releaseSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        whenNotPaused
    {

        // Get the payment registry information
        (
            address tokenAddress,
            uint dueDate,
            ,
            ,
            uint lastPaymentDate,
            address claimant,
            uint executionPeriod,
            uint staked
        ) = paymentRegistry.getPaymentInformation(_subscriptionIdentifier);

        // Check that it belongs to the rightful claimant/service node
        // This also means we're not talking about a first time payment
        require(claimant == msg.sender, "Must be the original claimant");

        // Ensure it's a valid subscription
        require(Collectable(_subscriptionContract).hasSubscriptionStarted(_subscriptionIdentifier) == true, "The subscription must be valid");

        // Make sure we're within the cancellation window
        uint minimumDate = lastPaymentDate + executionPeriod;
        uint interval = dueDate - lastPaymentDate;
        uint maximumDate = minimumDate + (interval / maximumIntervalDivisor);

        require(
            currentTimestamp() >= minimumDate && // Must be past last payment date and the execution period
            currentTimestamp() < maximumDate,  // Can't be past the cancellation period
            "The time period must not have passed"
        );

        // Call the remove claim on payments registry
        paymentRegistry.removeClaimant(
            _subscriptionIdentifier,
            msg.sender
        );

        // Unstake tokens
        stakeContract.unlockTokens(
            msg.sender,
            tokenAddress,
            staked
        );

        // Emit the correct event
        emit SubscriptionReleased(_subscriptionIdentifier, msg.sender, dueDate);

    }

    function getPricedGas(
        address _contractAddress,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress
    )
        public
        view
        returns (uint)
    {
        (uint gasCost, uint gasPrice) = Collectable(_contractAddress).getGasForExecution(_subscriptionIdentifier, 0);
        uint rate = approvedRegistry.getRateFor(_tokenAddress);
        uint standardCost = ((10**18) / rate) * (10**9) * (gasCost * (gasPrice / (10**9)));
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
        returns (uint timetstamp)
    {
        return block.timestamp;
    }

    /**
      * PRIVATE FUNCTION
    */

    function attemptProcessingWithSuccessCallback(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint _newLastPaymentDate,
        uint _amount,
        uint _fee,
        bool _firstPayment
    )
        private
        returns (bool success)
    {
        (bool result, ) = attemptProcessingWithSuccessAndLastPaymentCallback(
            _subscriptionContract,
            _subscriptionIdentifier,
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
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint _newLastPaymentDate,
        uint _amount,
        uint _fee,
        bool _firstPayment
    )
        private
        returns (bool success, bool finalPayment)
    {
       
        // Anyone who's processing a subscription should meet these guidelines
        require(stakeContract.getAvailableStake(msg.sender, _tokenAddress) > 1, "At least one token is required to process subscriptions");

        // Execute the actual payment
        bool paymentResult = address(this).call(
            bytes4(
                keccak256(
                    "attemptProcessing(address,bytes32,address,address,uint256,uint256,uint256)"
                )
            ), _subscriptionContract,
                _subscriptionIdentifier,
                _tokenAddress,
                _serviceNode,
                _newLastPaymentDate,
                _amount,
                _fee
        );

        // Update the last payment date in the volume subscription contract
        // If this reverts, that means the payment isn't ready
        Collectable subscription = Collectable(_subscriptionContract);
        (bool settingLastPaymentResult, bool finalPaymentResult) = subscription.setLastPaymentDate(_newLastPaymentDate, _subscriptionIdentifier);

        // @TODO: Add tests for this down the line
        if (_firstPayment == false) {
            require(finalPaymentResult == false, "An existing payment should never be marked as the final payment. Only reserved for scheduled/first time payments.");
        }

        // The set last payment result and last payment result both have to be true.
        // The reason why we don't put a require is because setLastPaymentDate might call an external contract
        // and we don't want a failure to stop a node from processing a payment.
        return (paymentResult && settingLastPaymentResult, finalPaymentResult);
        
    }

    function attemptProcessing(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
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

        Collectable subscription = Collectable(_subscriptionContract);

        (address consumer, address business) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        bool validSubscription = subscription.hasSubscriptionStarted(_subscriptionIdentifier);

        require(validSubscription == true, "Subscription must be valid");

        // @TODO: Make tests for gas cost subtraction
        uint pricedGas = getPricedGas(_subscriptionContract, _subscriptionIdentifier, _tokenAddress);
        makePayment(ERC20(_tokenAddress), consumer, business, _amount - _fee - pricedGas);
        makePayment(ERC20(_tokenAddress), consumer, _serviceNode, _fee + pricedGas);
    }

    function makePayment(
        ERC20 _transactingToken,
        address _from,
        address _to,
        uint _amount
    )
        private
        returns (bool)
    {
        // Get the businesses balance before the transaction
        uint balanceOfBusinessBeforeTransfer = _transactingToken.balanceOf(_to);

        // Check if the user has enough funds
        require(_transactingToken.balanceOf(_from) >= _amount, "The user doesn't have enough tokens");

        // Send currency to the destination business
        transferProxy.transferFrom(address(_transactingToken), _from, _to, _amount);

        // Check the business actually received the funds by checking the difference
        require((_transactingToken.balanceOf(_to) - balanceOfBusinessBeforeTransfer) == _amount, "Before and after balances don't match up");
    }

    function processingFailed(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        address _claimant,
        uint _staked
    )
        private
    {
        // Cancel if it hasn't already
        Collectable(_subscriptionContract).cancelSubscription(_subscriptionIdentifier);

        // Refund the gas to the service node by freeing up storage
        paymentRegistry.deletePayment(_subscriptionIdentifier);

        // Unstake tokens
        stakeContract.unlockTokens(
            _claimant,
            _tokenAddress,
            _staked
        );

        emit SubscriptionCancelled(_subscriptionContract, _subscriptionIdentifier);
    }

}