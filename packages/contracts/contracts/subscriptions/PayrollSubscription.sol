pragma solidity 0.4.24;

import "../interfaces/BillableInterface.sol";
import "../interfaces/ApprovedRegistryInterface.sol";

/** @title Contains all the data required for payroll subscriptions. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract PayrollSubscription is BillableInterface {

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
        string data;                    // Editable
    }

    ApprovedRegistryInterface public approvedRegistry;

    mapping (bytes32 => Payment) public payments;
    mapping (bytes32 => Schedule) public schedules;

    uint public gasPrice = 2*10**9;
    uint public gasCost = 200000;

    event CreatedSchedule (
        bytes32 indexed scheduleIdentifier,
        address indexed owner,
        uint indexed startDate,
        uint interval,
        bool oneOff,
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
        uint indexed amount
    );

    event UpdatedPayment (
        bytes32 indexed employeeIdentifier,
        uint indexed amount,
        address indexed destination,
        bytes32 scheduleIdentifier
    );

    event LastUpdatedPaymentDate(
        bytes32 indexed employeeIdentifier,
        bytes32 indexed scheduleIdentifier,
        uint indexed lastPaymentDate,
        bool isLastPayment
    );

    event TerminatedPayment (
        bytes32 indexed employeeIdentifier,
        bytes32 indexed scheduleIdentifier,
        uint indexed terminationDate
    );
 
    /**
      * BILLABLE INTERFACE FUNCTIONS
    */
    function getPaymentStatus(bytes32 _subscription)
        public
        view
        returns (uint status)
    {
        Payment memory payment = payments[_subscription];

        if (
            schedules[payment.scheduleIdentifier].terminationDate > 0 || 
            payment.terminationDate > 0 ||
            (schedules[payment.scheduleIdentifier].oneOff == true && payment.lastPaymentDate > 0)
        ) {
            return 2;
        }

        if (payment.lastPaymentDate > 0) {
            return 1;
        }

        return 0;
    }

    function getPaymentTokenAddress(bytes32 _subscription)
        public
        view
        returns (address subscriptionTokenAddress)
    {
        Payment memory payment = payments[_subscription];
        return schedules[payment.scheduleIdentifier].tokenAddress;
    }

    function getPaymentFromToAddresses(bytes32 _subscription)
        public
        view
        returns (address from, address to)
    {
        Payment memory payment = payments[_subscription];
        return (schedules[payment.scheduleIdentifier].owner, payment.destination);
    }

    function getPaymentInterval(bytes32 _subscription)
        public
        view
        returns (uint interval)
    {
        Payment memory payment = payments[_subscription];
        return schedules[payment.scheduleIdentifier].interval;
    }

    function getAmountDueFromPayment(bytes32 _subscription)
        public
        view
        returns (uint amount)
    {
        return payments[_subscription].amount;
    }

    function getPaymentFee(bytes32 _subscription)
        public
        view
        returns (uint fee)
    {
        Payment memory payment = payments[_subscription];
        return (payment.amount / schedules[payment.scheduleIdentifier].fee);
    }

    function getLastSubscriptionPaymentDate(bytes32 _subscription)
        public
        view
        returns (uint date)
    {
        return payments[_subscription].lastPaymentDate;
    }

    function getGasForExecution(bytes32 _subscription, uint _type)
        public
        view
        returns (uint returnedGasCost, uint returnedGasPrice)
    {
        return (gasCost, gasPrice);
    }

    function setLastestPaymentDate(uint _date, bytes32 _subscription)
        public
        onlyAuthorized
        returns (bool success, bool isFinalPayment)
    {

        Payment storage payment = payments[_subscription];

        require(payment.lastPaymentDate <= _date);

        payment.lastPaymentDate = _date;

        emit LastUpdatedPaymentDate(
            _subscription,
            payment.scheduleIdentifier,
            payment.lastPaymentDate,
            isFinalPayment
        );

        return (true, schedules[payment.scheduleIdentifier].oneOff);

    }

    function cancelPayment(bytes32 _subscription)
        public
        onlyAuthorized
    {

        Payment storage payment = payments[_subscription];
        require(payment.lastPaymentDate > 0);

        // If it hasn't been terminated, do it. Doesn't throw in case the executor calls it without knowing the status.
        if (payment.terminationDate == 0) {
            uint cancellationTimestamp = currentTimestamp();
            payment.terminationDate = cancellationTimestamp;

            emit TerminatedPayment (
                _subscription,
                payment.scheduleIdentifier,
                payment.terminationDate
            );
        }

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
        bool _oneOff,
        string _data
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
            msg.sender,
            _data
        );
        
        bytes32 scheduleHash = keccak256(msg.sender, _tokenAddress, _oneOff, currentTimestamp());
        require(schedules[scheduleHash].owner == 0);

        schedules[scheduleHash] = newSchedule;

        emit CreatedSchedule(
            scheduleHash,
            msg.sender,
            _startDate,
            _interval,
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

            emit CreatedPayment (
                id,
                scheduleHash,
                _amounts[i]
            );
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
        
        Schedule storage schedule = schedules[_scheduleIdentifier];

        require(schedule.owner == msg.sender, "Must be the original owner to set a new owner");
        require(_startDate > currentTimestamp(), "Must be a date in the future");

        schedule.startDate = _startDate;

        emit UpdatedSchedule(
            _scheduleIdentifier,
            schedule.owner,
            _startDate,
            schedule.interval,
            schedule.tokenAddress,
            schedule.fee
        );
    }

    function updateScheduleData(
        bytes32 _scheduleIdentifier,
        string _data
    )
        public
    {

        Schedule storage schedule = schedules[_scheduleIdentifier];
        require(schedule.owner == msg.sender, "Must be the original owner to set the data");

        schedule.data = _data;

        emit UpdatedSchedule(
            _scheduleIdentifier,
            schedule.owner,
            schedule.startDate,
            schedule.interval,
            schedule.tokenAddress,
            schedule.fee
        );

    }

    /** @dev Terminate a payment schedule */
    function terminateSchedule(
        bytes32 _scheduleIdentifier,
        uint _terminationDate
    )
        public
    {

        Schedule storage schedule = schedules[_scheduleIdentifier];

        require(schedule.owner == msg.sender, "Must be the original owner to set a new owner");
        require(_terminationDate > currentTimestamp(), "The termination date must be greater than the timestamp");

        schedule.terminationDate = _terminationDate;

        emit TerminatedSchedule (
            _scheduleIdentifier,
            schedule.owner,
            _terminationDate
        );

    }


    /** @dev Update multiple payments at once
      * @param _ids all the identifiers you wish to update.
      * @param _amounts all the corresponding amount dates.
      * @param _destinations all the corresponding destination addresses to pay out.
    */
    function updatePayments(
        bytes32[] _ids,
        uint[] _amounts,
        address[] _destinations
    ) 
        public
    {
        
        for (uint i = 0; i < _ids.length; i++)  {
            
            bytes32 id = _ids[i];
            Payment storage payment = payments[id];
            payment.amount = _amounts[i];
            payment.destination = _destinations[i];

            require(schedules[payment.scheduleIdentifier].owner == msg.sender, "You cannot update someone else's schedule");

            emit UpdatedPayment(
                id,
                payment.amount,
                payment.destination,
                payment.scheduleIdentifier
            );

        }

    }   

    /** @dev Terminate multiple payments at once
      * @param _ids all the identifiers you wish to terminate.
      * @param _terminationDates all the corresponding termination dates.
    */
    function terminatePayments(
        bytes32[] _ids,
        uint[] _terminationDates
    )
        public
    {
        
        for (uint i = 0; i < _ids.length; i++)  {

            require(_terminationDates[i] > currentTimestamp(), "The termination date must be greater than the current timestamp");
            
            bytes32 id = _ids[i];
            Payment storage payment = payments[id];
            payment.terminationDate = _terminationDates[i];

            require(schedules[payment.scheduleIdentifier].owner == msg.sender, "You cannot update someone else's payment");

            emit TerminatedPayment (
                id,
                payment.scheduleIdentifier,
                _terminationDates[i]
            );

        }

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