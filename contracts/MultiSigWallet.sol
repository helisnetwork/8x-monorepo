pragma solidity ^0.4.21;

/** @title Multi signature wallet - allows multiple parties to agree on transactions before execution */
/** @author Kerman Kohli - kerman@TBD.com, originally adapted from Stefan George - <stefan.george@consensys.net> */

contract MultiSigWallet {

    struct Transaction {
        address destination;
        uint value;
        bytes data;
        bool executed;
    }

    mapping (uint => Transaction) public transactions;
    mapping (uint => mapping (address => bool)) public confirmations;
    mapping (address => bool) isOwner;

    address[] public owners;

    uint public requiredCount;
    uint public transactionCount;

    uint constant public MAX_OWNER_COUNT = 50;

    event Confirmation(address indexed sender, uint indexed transactionId);
    event Revocation(address indexed sender, uint indexed transactionId);
    event Submission(uint indexed transactionId);
    event Execution(uint indexed transactionId);
    event ExecutionFailure(uint indexed transactionId);
    event Deposit(address indexed sender, uint value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint required);

    /*
     * Modifiers
    */

    modifier onlyWallet() {
        require(msg.sender == address(this));
        _;
    }

    modifier ownerDoesNotExist(address _owner) {
        require(!isOwner[_owner]);
        _;
    }

    modifier ownerExists(address _owner) {
        require(isOwner[_owner]);
        _;
    }

    modifier transactionExists(uint _transactionId) {
        require(transactions[_transactionId].destination != 0);
        _;
    }

    modifier confirmed(uint _transactionId, address _owner) {
        require(confirmations[_transactionId][_owner]);
        _;
    }

    modifier notConfirmed(uint _transactionId, address _owner) {
        require(!confirmations[_transactionId][_owner]);
        _;
    }

    modifier notExecuted(uint _transactionId) {
        require(!transactions[_transactionId].executed);
        _;
    }

    modifier notNull(address _address) {
        require(_address != 0);
        _;
    }

    modifier validRequirements(uint _ownerCount, uint _requiredCount) {
        require(
            _ownerCount <= MAX_OWNER_COUNT
                && _requiredCount <= _ownerCount
                && _requiredCount > 0
                && _ownerCount > 0
            );
        _;
    }

    /*
     * Fallback functions
    */

    function() public payable {

        // @TODO: Implementation

    }

    /*
     * Public functions
    */

    /* @dev Constructor for the multi-signature wallet.
     * @param _owners Array of the initial owners.
     * @param _requiredCount The number of required confirmations in order for a transaction to go through.
    */
    constructor(address[] _owners, uint _requiredCount)
        public
        validRequirements(_owners.length, _requiredCount)
    {
        for (uint i = 0; i < _owners.length; i++) {
            if (isOwner[_owners[i]] || _owners[i] == 0) {
                revert();
            }
            isOwner[_owners[i]] = true;
        }

        owners = _owners;
        requiredCount = _requiredCount;
        transactionCount = 0;
    }

    /* @dev Add a new owner. Only the wallet can execute this transaction.
     * @param _owner Address of the new to be added owner.
    */
    function addOwner(address _owner)
        public
        onlyWallet
        ownerDoesNotExist(_owner)
        notNull(_owner)
        validRequirements(owners.length + 1, requiredCount)
    {
        isOwner[_owner] = true;
        owners.push(_owner);
        OwnerAddition(_owner);
    }

    /* @dev Remove an owner. Only the wallet can execute this wallet.
     * @param _owner Address of the to be removed owner.
    */
    function removeOwner(address _owner) public {

        // @TODO: Implementation

    }

    /* @dev Replace an existing owner with a new one.
     * @param _owner The address of the owner to be replaced.
     * @param _newOwner The address of the new owner to take the existing one's place.
    */
    function replaceOwner(address _owner, address _newOwner) public {

        // @TODO: Implementation

    }

    /* @dev Change the required amount of confirmations to let a transaction execute.
     * @param _requiredCount Number of required owners need to execute.
    */
    function changeRequirement(uint _requiredCount) public {

        // @TODO: Implementation

    }

    /* @dev Allows an owner to submit a transaction and input their confirmation. Other owners' confirmation needed.
     * @param _destination Destination of the contract to execute on.
     * @param _value Ether required to execute transaction.
     * @param _data Any additional data or payload to pass along.
    */
    function submitTransaction(address _destination, uint _value, bytes _data)
        public
        ownerExists(msg.sender)
        returns (uint transactionId)
    {
        require(_destination != 0);
        transactionId = addTransaction(_destination, _value, _data);
        confirmTransaction(transactionId);
    }

    /* @dev Allows an owner to confirm a transaction submitted.
     * @param _transactionId Identifier for the transaction.
    */
    function confirmTransaction(uint _transactionId)
        public
        ownerExists(msg.sender)
        transactionExists(_transactionId)
        notConfirmed(_transactionId, msg.sender)
    {

        confirmations[_transactionId][msg.sender] = true;
        Confirmation(msg.sender, _transactionId);
    }

    /* @dev Allows an owner to revoke a transaction they've confirmed.
     * @param _transactionId Identifier for the transaction.
    */
    function revokeConfirmation(uint _transactionId) public {

        // @TODO: Implementation

    }

    /* @dev Excute a transaction that has enough confirmations.
     * @param _transactionId Identifier for the transaction.
    */
    function executeTransaction(uint _transactionId)
        public
        ownerExists(msg.sender)
        notExecuted(_transactionId)
    {
        if (isConfirmed(_transactionId)) {
            Transaction transactionToExecute = transactions[_transactionId];
            transactionToExecute.executed = true;
            if (transactionToExecute.destination.call.value(transactionToExecute.value)(transactionToExecute.data)) {
                Execution(_transactionId);
            } else {
                ExecutionFailure(_transactionId);
                transactionToExecute.executed = false;
            }
        }
    }

    /* @dev Check if a transaction has enough confirmations.
     * @param _transactionId Identifier for the transaction.
     * @return Confirmation status of transaction.
    */
    function isConfirmed(uint _transactionId)
        public
        returns (bool confirmed) {

        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[_transactionId][owners[i]]) {
                count += 1;
            }
            if (count == requiredCount) {
                return true;
            }
        }

        return false;
    }

    /* @dev Return the number of confirmations for a transaction.
     * @param _transactionId Identifier for the transaction.
     * @return confirmationCount Number of confirmations from owners.
    */
    function getConfirmationCount(uint _transactionId)
        public
        returns (uint confirmationCount) {

        // @TODO: Implementation

    }

    /* @dev Return the number of transactions.
     * @param _pending Including transactions which are pending.
     * @param _executed Including transactions which have been executed.
     * @return transactionCount Number of transactions.
    */
    function getTransactionCount(
        bool _pending,
        bool _executed
    )
        public
        returns (uint transactionCount) {

        // @TODO: Implementation

    }

    /* @dev Get the owners of the multi signature wallet.
     * @return returnedOwners Array of all the owners.
    */
    function getOwners() public view returns (address[] returnedOwners) {
        return owners;
    }

    /* @dev Returns an array of the list of owners who confirmed a transaction.
     * @param _transactionId Identifier for the transaction.
     * @return confirmedAddresses All the owners' addresses who confirmed the transaction.
    */
    function getConfirmationIds(uint _transactionId) public returns (address[] confirmedAddresses) {

        // @TODO: Implementation

    }

    /* @dev Returns an array of all the transactions in a specified range.
     * @param _from Staring index position to look from.
     * @param _to Finishing index position.
     * @param _pending Including pending transactions.
     * @param _executed Including executed transactions.
     * @return transactionIds All the transactionId's in the specified range with the defined condtions.
    */
    function getTransactionIds(
        uint _from,
        uint _to,
        bool _pending,
        bool _executed
    )
        public
        returns (address[] transactionIds) {

        // @TODO: Implementation

    }

    /*
     * Internal functions
    */

    /* @dev Add a new transaction to the transactions mapping if it doesn't exist.
     * @param _destination Destination of the contract to execute on.
     * @param _value Ether required to execute transaction.
     * @param _data Any additional data or payload to pass along.
     * @returns transactionId Identifier for the transaction.
    */
    function addTransaction(address _destination, uint _value, bytes _data)
        internal
        returns (uint transactionId)
    {
        transactionCount++;
        transactions[transactionCount] = Transaction({
            destination: _destination,
            value: _value,
            data: _data,
            executed: false
        });

        return transactionCount;
    }

}