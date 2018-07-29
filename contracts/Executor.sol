pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/token/WETH.sol";

import "./Collectable.sol";
import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";
import "./KyberNetworkInterface.sol";
import "./ApprovedRegistry.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    KyberNetworkInterface public kyberProxy;
    ApprovedRegistry public approvedRegistry;

    uint public cancellationPeriod;

    event SubscriptionActivated(address subscriptionAddress, bytes32 subscriptionIdentifer);
    event SubscriptionProcessed(address subscriptionAddress, bytes32 subscriptionIdentifer, address claimant);
    event SubscriptionReleased(address subscriptionAddress, bytes32 subscriptionIdentifier, address claimant);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Set the addresses for the relevant contracts
      * @param _transferProxyAddress the address for the designated transfer proxy.
      * @param _stakeContractAddress the address for the stake contract.
      * @param _paymentRegistryAddress the address for the payment registry.
      * @param _kyberAddress the address for the kyber network contract.
    */
    constructor(
        address _transferProxyAddress,
        address _stakeContractAddress,
        address _paymentRegistryAddress,
        address _kyberAddress,
        address _approvedRegistryAddress
    )
        public
    {
        // @TODO: Figure out how to add tests for this

        transferProxy = TransferProxy(_transferProxyAddress);
        stakeContract = StakeContract(_stakeContractAddress);
        paymentRegistry = PaymentRegistry(_paymentRegistryAddress);
        kyberProxy = KyberNetworkInterface(_kyberAddress);
        approvedRegistry = ApprovedRegistry(_approvedRegistryAddress);
    }

    /** @dev Set the amount of time after a payment a service node has to cancel.
      * @param _period is the amount of time they have.
    */
    function setCancellationPeriod(uint _period) public onlyOwner {
        cancellationPeriod = _period;
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
        makeSafePayment(transactingToken, consumer, business, amountDue);

        // Create a new record in the payments registry
        paymentRegistry.createNewPayment(
            _subscriptionIdentifier, // Subscription identifier
            address(transactingToken), // Token address
            currentTimestamp() + subscriptionInterval, // Next due date
            amountDue, // Amount due
            fee // Fee
        );

        // Start the subscription
        subscription.setStartDate(currentTimestamp(), _subscriptionIdentifier);

        // Emit the appropriate event to show subscription has been activated
        emit SubscriptionActivated(_subscriptionContract, _subscriptionIdentifier);
    }

    /** @dev Collect the payment due from the subscriber.
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function collectPayment(
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
            uint executionPeriod,
            uint stakeMultiplier
        ) = paymentRegistry.getPaymentInformation(_subscriptionIdentifier);

        // Check to make sure the payment is due
        require(currentTimestamp() >= dueDate);

        // Check to make sure it hasn't been claimed by someone else or belongs to you
        require(claimant == msg.sender || claimant == 0);

        // Check it isn't too late to claim (past execution) or too late
        Collectable subscription = Collectable(_subscriptionContract);
        uint interval = subscription.getSubscriptionInterval(_subscriptionIdentifier);
        // @TODO: Implementation

        // Check that the service node calling has enough staked tokens
        if (stakeMultiplier == 0) {
            require(stakeContract.getAvailableStake(msg.sender, tokenAddress) >= (currentMultiplierFor(tokenAddress) * amount));
        }

        // Make payments to the business and service node
        makeSafePayments(
            _subscriptionContract,
            _subscriptionIdentifier,
            tokenAddress,
            msg.sender,
            amount,
            fee
        );

        // If the current multiplier is lower than the one in the object, free the difference
        if (stakeMultiplier > currentMultiplierFor(tokenAddress)) {
            stakeContract.unstakeTokens(
                msg.sender,
                tokenAddress,
                (stakeMultiplier - currentMultiplierFor(tokenAddress)) * amount
            );
        } else if (stakeMultiplier == 0) {
            stakeContract.stakeTokens(msg.sender, tokenAddress, currentMultiplierFor(tokenAddress) * amount);
        }

        // Update the payment registry
        paymentRegistry.claimPayment(
            _subscriptionIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            dueDate + interval, // Next payment due date
            currentMultiplierFor(tokenAddress) // Current multiplier set for the currency
        );

        // Emit the subscription processed event
        emit SubscriptionProcessed(_subscriptionContract, _subscriptionIdentifier, msg.sender);

    }

    /** @dev Release the payment/responsibility of a service node
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function releasePayment(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
    {

        // Get the payment registry information
        (
            address tokenAddress,
            ,
            uint amount,
            ,
            uint lastPaymentDate,
            address claimant,
            uint executionPeriod,
            uint stakeMultiplier
        ) = paymentRegistry.getPaymentInformation(_subscriptionIdentifier);

        // Make sure we're within the cancellation window
        uint minimumDate = lastPaymentDate + executionPeriod;
        require(
            currentTimestamp() >= minimumDate && // Must be past last payment date and the execution period
            currentTimestamp() < (minimumDate + cancellationPeriod) // Can't be past the cancellation period
        );

        // Check that it belongs to the rightful claimant/service node
        require(claimant == msg.sender);

        // Call the remove claim on payments registry
        paymentRegistry.removeClaimant(
            _subscriptionIdentifier,
            msg.sender
        );

        // Unstake tokens
        stakeContract.unstakeTokens(
            msg.sender,
            tokenAddress,
            amount * stakeMultiplier
        );

        // Emit the correct event
        emit SubscriptionReleased(_subscriptionContract, _subscriptionIdentifier, msg.sender);

    }

    function catchLatePayment(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
    {

        // @TODO: Implementation

        // Get the payment object
        // First make sure it's past the due date and execution period
        // Call collect payment function as this caller
        // Slash the tokens and give them to this caller = $$$
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

    /**
      * PRIVATE FUNCTION
    */

    function makeSafePayments(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        address _tokenAddress,
        address _serviceNode,
        uint _amount,
        uint _fee
    )
        private
    {
        Collectable subscription = Collectable(_subscriptionContract);
        ERC20 transactingToken = ERC20(_tokenAddress);

        (address consumer, address business) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        makeSafePayment(transactingToken, consumer, business, _amount - _fee);
        makeSafePayment(transactingToken, consumer, _serviceNode, _fee);
    }

    function makeSafePayment(
        ERC20 _transactingToken,
        address _from,
        address _to,
        uint _amount
    )
        private
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

    function currentMultiplierFor(address _tokenAddress) public returns(uint) {
        return approvedRegistry.getMultiplierFor(_tokenAddress);
    }

}