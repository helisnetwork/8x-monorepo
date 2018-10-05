pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/token/WETH.sol";

import "./Collectable.sol";
import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";

import "./interfaces/ApprovedRegistryInterface.sol";
import "./interfaces/RequirementsInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    ApprovedRegistryInterface public approvedRegistry;
    RequirementsInterface public requirementsContract;

    uint public lockUpPercentage; // 1 Decimal Places (80.0% = 800).
    uint public maximumIntervalDivisor; // Latest to claim a payment or cancel.

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

    event Checkpoint(uint number);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Set the addresses for the relevant contracts
      * @param _transferProxyAddress the address for the designated transfer proxy.
      * @param _stakeContractAddress the address for the stake contract.
      * @param _paymentRegistryAddress the address for the payment registry.
      * @param _approvedRegistryAddress the address for the approved registry contract.
      * @param _requirementsAddress the address for the requirements contract.
    */
    constructor(
        address _transferProxyAddress,
        address _stakeContractAddress,
        address _paymentRegistryAddress,
        address _approvedRegistryAddress,
        address _requirementsAddress,
        uint _lockUpPercentage,
        uint _divisor
    )
        public
    {
        // @TODO: Figure out how to add tests for this
        transferProxy = TransferProxy(_transferProxyAddress);
        stakeContract = StakeContract(_stakeContractAddress);
        paymentRegistry = PaymentRegistry(_paymentRegistryAddress);
        approvedRegistry = ApprovedRegistryInterface(_approvedRegistryAddress);
        requirementsContract = RequirementsInterface(_requirementsAddress);
        lockUpPercentage = _lockUpPercentage;
        maximumIntervalDivisor = _divisor;
    }

    /** @dev Set the percentage of tokens to lock up.
      * @param _percentage is the percentage to 1 decimal place. 80.0% = 800;
    */
    function setPercentageLockUp(uint _percentage) public onlyOwner {
        // @TODO: Add tests for this.
        lockUpPercentage = _percentage;
    }

    /** @dev Set the maximum time for a subscription to go on unprocessed or to cancel afterwards.
      *      Expressed as a divisor of the interval.
      * @param _divisor is the divisor (eg 30 days / 7 = ~4).
    */
    function setMaximumIntervalDivisor(uint _divisor) public onlyOwner {
        // @TODO: Add tests for this.
        maximumIntervalDivisor = _divisor;
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
        returns (bool success)
    {

        // Initiate an instance of the collectable subscription
        Collectable subscription = Collectable(_subscriptionContract);

        // Check if the subscription is valid
        require(approvedRegistry.isContractAuthorised(_subscriptionContract));
        require(subscription.isValidSubscription(_subscriptionIdentifier) == false);

        // Get the detauls of the subscription
        ERC20 transactingToken = ERC20(subscription.getSubscriptionTokenAddress(_subscriptionIdentifier));
        uint subscriptionInterval = subscription.getSubscriptionInterval(_subscriptionIdentifier);
        uint amountDue = subscription.getAmountDueFromSubscription(_subscriptionIdentifier);
        uint fee = subscription.getSubscriptionFee(_subscriptionIdentifier);
        (address consumer, address business) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        // Make the payment safely
        makePayment(transactingToken, consumer, business, amountDue);

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
    {
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
        ) = paymentRegistry.getPaymentInformation(_subscriptionIdentifier);

        // Ensure it's a fresh subscription or only the claimant
        require(claimant == 0 || claimant == msg.sender);

        // Make sure it's actually due
        require(currentTimestamp() >= dueDate);

        // Make sure it isn't too late to process
        uint interval = (dueDate - lastPaymentDate);
        require(currentTimestamp() < (dueDate + (interval / maximumIntervalDivisor)));


        if (attemptProcessingWithCallback(
            _subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, dueDate, amount, fee, staked
        ) == false) {
            processingFailed(_subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, staked);
            return;
        }

        uint lockUp;

        // To whover is reading this, I had to duplicate determineStake() twice because of too
        // many variables in the local stack. Blame the game, not the player.

        if (claimant == 0) {
            lockUp = processFirstTime(
                _subscriptionIdentifier,
                tokenAddress,
                dueDate,
                staked,
                interval,
                determineStake(tokenAddress, dueDate, interval)
            );
        } else if (claimant == msg.sender) {
            lockUp = processExisting(
                _subscriptionIdentifier,
                tokenAddress,
                dueDate,
                staked,
                interval,
                determineStake(tokenAddress, dueDate, interval)
            );
        }

        emit SubscriptionProcessed(
            _subscriptionIdentifier,
            msg.sender,
            dueDate + interval,
            lockUp
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
    {

        // Get the payment registry informatio
        (
            address tokenAddress,
            uint dueDate,
            uint amount,
            ,
            uint lastPaymentDate,
            address claimant,
            uint executionPeriod,
            uint staked
        ) = paymentRegistry.getPaymentInformation(_subscriptionIdentifier);

        // Check that it belongs to the rightful claimant/service node
        // This also means we're not talking about a first time payment
        require(claimant == msg.sender);

        // Ensure it's a valid subscription
        require(Collectable(_subscriptionContract).isValidSubscription(_subscriptionIdentifier) == true);

        // Make sure we're within the cancellation window
        uint minimumDate = lastPaymentDate + executionPeriod;
        uint interval = dueDate - lastPaymentDate;
        uint maximumDate = minimumDate + (interval / maximumIntervalDivisor);

        require(
            currentTimestamp() >= minimumDate && // Must be past last payment date and the execution period
            currentTimestamp() < maximumDate  // Can't be past the cancellation period
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

    /** @dev Catch another service node who didn't process their payment on time.
      * @param _subscriptionContract is the contract where the details exist (adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function catchLateSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
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
        require(currentTimestamp() > (dueDate + executionPeriod));

        // Ensure the original claimant can't call this function
        require(msg.sender != claimant);

        // Make the payment
        bool didProcess = attemptProcessingWithCallback(
            _subscriptionContract, _subscriptionIdentifier, tokenAddress, msg.sender, dueDate, amount, fee, staked
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

    function determineStake(
        address _tokenAddress,
        uint _startDate,
        uint _interval
    )
        public
        returns(uint)
    {
        (
            uint total,
            uint lockedUp,
            uint gini,
            uint divideBy
        ) = stakeContract.getTokenStakeDetails(_tokenAddress);

        uint stake = requirementsContract.getStake(
            gini,
            divideBy,
            _startDate,
            currentTimestamp(),
            _startDate + (_interval / maximumIntervalDivisor),
            total - lockedUp
        );

        return stake;
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

    function attemptProcessingWithCallback(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint _newLastPaymentDate,
        uint _amount,
        uint _fee,
        uint _staked
    )
        private
        returns (bool)
    {
        return address(this).call(
            bytes4(
                keccak256(
                    "attemptProcessing(address,bytes32,address,address,uint256,uint256,uint256,uint256)"
                )
            ), _subscriptionContract,
                _subscriptionIdentifier,
                _tokenAddress,
                _serviceNode,
                _newLastPaymentDate,
                _amount,
                _fee,
                _staked
        );
    }

    function attemptProcessing(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint256 _newLastPaymentDate,
        uint256 _amount,
        uint256 _fee,
        uint256 _staked
    )
        external
    {
        // Essentially it's a private function without the private modifier so that the
        // .call() function can be used.

        require(msg.sender == address(this));

        Collectable subscription = Collectable(_subscriptionContract);

        (address consumer, address business) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        bool validSubscription = subscription.isValidSubscription(_subscriptionIdentifier);

        require(validSubscription == true);

        // @TODO: Make tests for gas cost subtraction
        uint pricedGas = getPricedGas(_subscriptionContract, _subscriptionIdentifier, _tokenAddress);
        makePayment(ERC20(_tokenAddress), consumer, business, _amount - _fee - pricedGas);
        makePayment(ERC20(_tokenAddress), consumer, _serviceNode, _fee + pricedGas);

        // Update the last payment date in the volume subscription contract
        subscription.setLastPaymentDate(_newLastPaymentDate, _subscriptionIdentifier);
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
        require(_transactingToken.balanceOf(_from) >= _amount);

        // Send currency to the destination business
        transferProxy.transferFrom(address(_transactingToken), _from, _to, _amount);

        // Check the business actually received the funds by checking the difference
        require((_transactingToken.balanceOf(_to) - balanceOfBusinessBeforeTransfer) == _amount);
    }

    function processFirstTime(
        bytes32 subscriptionIdentifier,
        address tokenAddress,
        uint dueDate,
        uint staked,
        uint interval,
        uint requiredStake
    )
        private
        returns (uint)
    {
        // Check if they have enough tokens available
        uint availableStake = stakeContract.getAvailableStake(msg.sender, tokenAddress);
        require(availableStake >= requiredStake);

        uint lockUp = (availableStake * lockUpPercentage) / 1000;
        stakeContract.lockTokens(msg.sender, tokenAddress, lockUp);

        paymentRegistry.claimPayment(
            subscriptionIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            dueDate + interval, // Next payment due date
            lockUp
        );

        return lockUp;
    }

    function processExisting(
        bytes32 subscriptionIdentifier,
        address tokenAddress,
        uint dueDate,
        uint staked,
        uint interval,
        uint requiredStake
    )
        private
        returns (uint)
    {
        uint lockUp = requiredStake;

        if (requiredStake < staked) {
            uint difference = staked - requiredStake;

            stakeContract.unlockTokens(
                msg.sender,
                tokenAddress,
                difference
            );
        } else {
            lockUp = staked;
        }

        paymentRegistry.claimPayment(
            subscriptionIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            dueDate + interval, // Next payment due date
            lockUp
        );

        return lockUp;

    }

    function getPricedGas(
        address _contractAddress,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress
    )
        private
        returns (uint)
    {
        // @ TODO: Tests
        (uint gasCost, uint gasPrice) = Collectable(_contractAddress).getGasForExecution(_subscriptionIdentifier, 0);
        uint rate = approvedRegistry.getRateFor(_tokenAddress);
        uint standardCost = ((gasCost * gasPrice / (10**9)) * ((10**18) / rate));
        return standardCost;
    }

}