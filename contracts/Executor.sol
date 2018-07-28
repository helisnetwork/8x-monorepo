pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/token/WETH.sol";

import "./Collectable.sol";
import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";
import "./KyberNetworkInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    struct GasCost {
        uint callValue;
        uint gasCost;
        uint gasPrice;
    }

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    KyberNetworkInterface public kyberProxy;

    mapping (address => uint) public approvedTokenMapping;
    mapping (address => mapping (uint => GasCost)) public approvedContractMapping;

    address[] public approvedContractArray;
    address[] public approvedTokenArray;

    uint public cancellationPeriod;

    event LogAuthorizedContractAdded(address indexed target);
    event LogAuthorizedContractRemoved(address indexed target);
    event LogAuthorizedTokenAdded(address indexed target);
    event LogAuthorizedTokenRemoved(address indexed target);
    event LogAuthorizedTokenMultiplierSet(address indexed tokenAddress, uint indexed multiplier);

    event SubscriptionActivated(address subscriptionAddress, bytes32 subscriptionIdentifer);
    event SubscriptionProcessesed(address subscriptionAddress, bytes32 subscriptionIdentifer);

    event ContractGasCostSet(address indexed contractAddress, uint indexed index);
    event ContractGasCostRemoved(address indexed contractAddress, uint indexed index);

    /**
      * MODIFIERS
    */

    modifier isValidSubscriptionContract(address _subscriptionContract) {
        require(approvedContractMapping[_subscriptionContract][0].callValue > 0);
        _;
    }

    modifier hasContractBeenApproved(address _contractAddress, bool _expectedResult) {
        bool contractFoundInRegistry = false;

        for (uint i = 0; i < approvedContractArray.length; i++) {
            if (approvedContractArray[i] == _contractAddress) {
                contractFoundInRegistry = true;
                break;
            }
        }

        require(contractFoundInRegistry == _expectedResult);
        _;
    }

    modifier hasTokenBeenApproved(address _tokenAddress, bool _expectedResult) {
        bool tokenFoundInRegistry = false;

        for (uint i = 0; i < approvedTokenArray.length; i++) {
            if (approvedTokenArray[i] == _tokenAddress) {
                tokenFoundInRegistry = true;
                break;
            }
        }

        require(tokenFoundInRegistry == _expectedResult);
        _;
    }

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
        address _kyberAddress
    )
        public
    {
        // @TODO: Figure out how to add tests for this

        transferProxy = TransferProxy(_transferProxyAddress);
        stakeContract = StakeContract(_stakeContractAddress);
        paymentRegistry = PaymentRegistry(_paymentRegistryAddress);
        kyberProxy = KyberNetworkInterface(_kyberAddress);
    }

    /** @dev Set the amount of time after a payment a service node has to cancel.
      * @param _period is the amount of time they have.
    */
    function setCancellationPeriod(uint _period) public onlyOwner {
        cancellationPeriod = _period;
    }

    /** @dev Add an approved subscription contract to be used.
      * @param _contractAddress is the address of the subscription contract.
    */
    function addApprovedContract(address _contractAddress)
        public
        onlyOwner
        hasContractBeenApproved(_contractAddress, false)
    {
        approvedContractArray.push(_contractAddress);
        emit LogAuthorizedContractAdded(_contractAddress);
    }

    /** @dev Set an approved contract call cost.
      * @param _contractAddress is the address of the subscription contract.
      * @param _index is the reference to the call (cancel, subscribe etc).
      * @param _callValue is how much the transaction will cost.
      * @param _gasCost is the amount of gas that will be used.
      * @param _gasPrice is the gas price that will be reimbursed up to.
    */
    function setApprovedContractCallCost(
        address _contractAddress,
        uint _index,
        uint _callValue,
        uint _gasCost,
        uint _gasPrice
    )
        public
        onlyOwner
        hasContractBeenApproved(_contractAddress, true)
    {
        approvedContractMapping[_contractAddress][_index] = GasCost({
            callValue: _callValue,
            gasCost: _gasCost,
            gasPrice: _gasPrice
        });

        emit ContractGasCostSet(_contractAddress, _index);

    }

    /** @dev Add an approved token to be used.
      * @param _tokenAddress is the address of the token to be used.
    */
    function addApprovedToken(address _tokenAddress)
        public
        onlyOwner
        hasTokenBeenApproved(_tokenAddress, false)
    {
        approvedTokenArray.push(_tokenAddress);
        emit LogAuthorizedTokenAdded(_tokenAddress);
    }

    /** @dev Set an approved token multiplier.
      * @param _tokenAddress is the address of the token to be used.
      * @param _multiplier is the amount of this token required for each subscription.
    */
    function setApprovedTokenMultiplier(
        address _tokenAddress,
        uint _multiplier
    )
        public
        onlyOwner
        hasTokenBeenApproved(_tokenAddress, true)
    {
        approvedTokenMapping[_tokenAddress] = _multiplier;
        emit LogAuthorizedTokenMultiplierSet(_tokenAddress, _multiplier);

    }

    /** @dev Remove an approved subscription contract.
      * @param _contractAddress is the address of the subscription contract.
    */
    function removeApprovedContract(address _contractAddress)
        public
        onlyOwner
    {
        for (uint i = 0; i < approvedContractArray.length; i++) {
            if (approvedContractArray[i] == _contractAddress) {
                approvedContractArray[i] = approvedContractArray[approvedContractArray.length - 1];
                approvedContractArray.length--;

                emit LogAuthorizedContractRemoved(_contractAddress);

                break;
            }
        }
    }

    /** @dev Remove an approved contract call cost.
      * @param _contractAddress is the address of the contract.
      * @param _index is the reference to the call (cancel, subscribe etc).
    */
    function removeApprovedContractCallCost(
        address _contractAddress,
        uint _index
    )
        public
        onlyOwner
    {
        delete approvedContractMapping[_contractAddress][_index];

        emit ContractGasCostRemoved(_contractAddress, _index);
    }

    /** @dev Remove an approved token to be used.
      * @param _tokenAddress is the address of the token to remove.
    */
    function removeApprovedToken(address _tokenAddress)
        public
        onlyOwner
    {
        for (uint i = 0; i < approvedTokenArray.length; i++) {
            if (approvedTokenArray[i] == _tokenAddress) {
                approvedTokenArray[i] = approvedTokenArray[approvedTokenArray.length - 1];
                approvedTokenArray.length--;

                delete approvedTokenMapping[_tokenAddress];

                emit LogAuthorizedTokenRemoved(_tokenAddress);

                break;
            }
        }
    }

    /** @dev Get approved contract array.
    */
    function getApprovedContracts()
        public
        constant
        returns (address[])
    {
        return approvedContractArray;
    }

    /** @dev Get approved token array.
    */
    function getApprovedTokens()
        public
        constant
        returns (address[])
    {
        return approvedTokenArray;
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
        isValidSubscriptionContract(_subscriptionContract)
        returns (bool success)
    {

        // Initiate an instance of the collectable subscription
        Collectable subscription = Collectable(_subscriptionContract);

        // Check if the subscription is even valid
        require(subscription.isValidSubscription(_subscriptionIdentifier) == false);

        // Check if the token is authorised
        ERC20 transactingToken = ERC20(subscription.getSubscriptionTokenAddress(_subscriptionIdentifier));

        require(approvedTokenMapping[address(transactingToken)] > 0);

        // Get the detauls of the subscription
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
            require(stakeContract.getAvailableStake(msg.sender) >= (currentMultiplierFor(tokenAddress) * amount));
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
        // @TODO: Implementation

        // Lock up staked tokens
        stakeContract.stakeTokens(msg.sender, currentMultiplierFor(tokenAddress) * amount);

        // Update the payment registry
        paymentRegistry.claimPayment(
            _subscriptionIdentifier, // Identifier of subscription
            msg.sender, // The claimant
            dueDate + interval, // Next payment due date
            currentMultiplierFor(tokenAddress) // Current multiplier set for the currency
        );

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

        // @TODO: Implementation

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
        return approvedTokenMapping[_tokenAddress];
    }

}