pragma solidity 0.4.24;

import "../Collectable.sol";
import "../interfaces/ApprovedRegistryInterface.sol";

/** @title Contains all the data required for payroll subscriptions. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract PayrollSubscription is Collectable {

    struct Payment {
        uint amount;                    // Editable
        address destination;            // Editable
        uint lastPaymentDate;           // Editable (authorised)
        uint terminationDate;           // Can only be set once
        bytes32 scheduleIdentifier;     // Can only be set on creation
    }
    
    struct Schedule {
        uint interval;                  // Not editable
        uint fee;                       // Editable, expressed as a divisor to 2 decimals. 10000 = 0.01%.
        address tokenAddress;           // Not editable
        uint startDate;                 // Editable
        uint terminationDate;           // Can only be set once
        bool oneOff;                    // Can only be set on creation
        address owner;                  // Editable
    }

    ApprovedRegistryInterface public approvedRegistry;

    mapping (bytes32 => Payment) public payments;
    mapping (bytes32 => Schedule) public schedules;

    uint public gasPrice = 2*10**9;
    uint public gasCost = 200000;

    event CreatedSchedule (
        bytes32 indexed scheduleIdentifier,
        address indexed owner,
        bool indexed oneOff,
        uint fee
    );

    event UpdatedSchedule (
        bytes32 indexed scheduleIdentifier,
        address indexed owner,
        uint indexed startDate,
        uint interval,
        address tokenAddress,
        uint fee
    );

    event TerminatedSchedule (
        bytes32 indexed scheduleIdentifier,
        address indexed owner,
        uint indexed terminationDate
    );

    event CreatedPayment (
        bytes32 indexed employeeIdentifier,
        bytes32 indexed scheduleIdentifier,
        uint indexed startDate,
        uint interval,
        address tokenAddress,
        bool oneOff
    );

    event UpdatedPayment (
        bytes32 indexed employeeIdentifier,
        bytes32 indexed amount,
        uint indexed startDate,
        bytes32 scheduleIdentifier,
        address destination
    );

    event LastUpdatedPaymentDate(
        bytes32 indexed employeeIdentifier,
        bytes32 indexed scheduleIdentifier,
        uint indexed lastPaymentDate
    );

    event TerminatedPayment (
        bytes32 indexed employeeIdentifier,
        bytes32 indexed scheduleIdentifier,
        uint indexed terminationDate
    );
 
    /**
      * COLLECTABLE INTERFACE FUNCTIONS
    */
    function hasSubscriptionStarted(bytes32 _subscription)
        public
        view
        returns (bool success)
    {
        return false;
    }

    function getSubscriptionTokenAddress(bytes32 _subscription)
        public
        view
        returns (address subscriptionTokenAddress)
    {
        return 0;
    }

    function getSubscriptionFromToAddresses(bytes32 _subscription)
        public
        view
        returns (address from, address to)
    {
        return (0, 0);
    }

    function getSubscriptionInterval(bytes32 _subscription)
        public
        view
        returns (uint interval)
    {
        return 0;
    }

    function getAmountDueFromSubscription(bytes32 _subscription)
        public
        view
        returns (uint amount)
    {
        return 0;
    }

    function getSubscriptionFee(bytes32 _subscription)
        public
        view
        returns (uint fee)
    {
        return 0;
    }

    function getLastSubscriptionPaymentDate(bytes32 _subscription)
        public
        view
        returns (uint date)
    {
        return 0;
    }

    function getGasForExecution(bytes32 _subscription, uint _type)
        public
        view
        returns (uint returnedGasCost, uint returnedGasPrice)
    {
        return (gasCost, gasPrice);
    }

    function setLastPaymentDate(uint _date, bytes32 _subscription)
        public
        returns (bool isFinalPayment)
    {

    }

    function cancelSubscription(bytes32 _subscription)
        public
    {
        
    }

    /**
      * PUBLIC FUNCTIONS
    */
    constructor(address _approvedRegistryAddress) public {
        approvedRegistry = ApprovedRegistryInterface(_approvedRegistryAddress);
    }

    function createScheduleWithPayments(
        bytes32[] _ids,
        uint[] _amounts,
        address[] _destinations,
        address _tokenAddress,
        uint _startDate,
        uint _interval,
        uint _fee,
        bool _oneOff
    ) 
        public
        returns (bytes32)
    {

        require(_startDate > 0, "You need to set a starting date");
        require(_fee > 0, "Cannot create payment with no fee");
        require((_oneOff == false && _interval > 0) || (_oneOff == true), "If the payment is not one off, it requires an interval");

        // Add tests for this
        require(_ids.length > 0, "You need to pass in at least one identifier");
    
        Schedule memory newSchedule = Schedule(
            _interval,
            _fee,
            _tokenAddress,
            _startDate,
            0,
            _oneOff,
            msg.sender
        );
        
        bytes32 scheduleHash = keccak256(msg.sender, _tokenAddress, _oneOff);
        require(schedules[scheduleHash].owner == 0);

        schedules[scheduleHash] = newSchedule;

        emit CreatedSchedule(
            scheduleHash,
            msg.sender,
            _oneOff,
            _fee
        );
        
        for (uint i = 0; i < _ids.length; i++)  {
            
            bytes32 id = _ids[i];

            Payment memory newPayment = Payment(
                _amounts[i],
                _destinations[i],
                0,
                0,
                scheduleHash
            );
            
            require(payments[id].scheduleIdentifier == 0);
            payments[id] = newPayment;
        }
        
        return scheduleHash;

    }

    function updateScheduleOwner(
        bytes32 _scheduleIdentifier,
        address _owner
    ) 
        public
    {

        Schedule storage schedule = schedules[_scheduleIdentifier];

        require(schedule.owner == msg.sender, "Must be the original owner to set a new owner");

        schedule.owner = _owner;
        
        emit UpdatedSchedule(
            _scheduleIdentifier,
            _owner,
            schedule.startDate,
            schedule.interval,
            schedule.tokenAddress,
            schedule.fee
        );

    }

    function updateStartDate(
        bytes32 _scheduleIdentifier,
        uint _startDate
    ) 
        public
    {

    }

    function terminateSchedule(
        bytes32 _scheduleIdentifier,
        uint _terminationDate
    )
        public
    {

    }

    function updatePayments(
        bytes32[] _ids,
        uint[] _amounts,
        address[] _destinations,
        bytes32 _scheduleIdentifier
    ) 
        public
    {

    }

    function terminatePayments(
        bytes32[] _ids,
        uint[] _terminationDates
    )
        public
    {

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