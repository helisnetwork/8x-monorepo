pragma solidity 0.4.24;

import "../Collectable.sol";
import "../interfaces/ApprovedRegistryInterface.sol";

/** @title Contains all the data required for payroll subscriptions. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract PayrollSubscription is Collectable {

    struct Payment {
        uint amount;
        address destination;
        uint lastPaymentDate;
        uint terminationDate;
        bytes32 scheduleIdentifier;
    }
    
    struct Schedule {
        uint interval;
        address tokenAddress;
        uint startDate;
        bool oneOff;
        address owner;
    }

    ApprovedRegistryInterface public approvedRegistry;

    mapping (bytes32 => Payment) public payments;
    mapping (bytes32 => Schedule) public schedules;

    uint public gasPrice = 2*10**9;
    uint public gasCost = 200000;

    /**
      * COLLECTABLE INTERFACE FUNCTIONS
    */
    function isValidSubscription(bytes32 _subscription)
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
        bytes32[] ids,
        uint[] amounts,
        address[] destinations,
        address tokenAddress,
        uint startDate,
        uint interval,
        bool oneOff,
        uint elements
    ) 
        public
    {
    
    }

    function updatePayments(
        bytes32[] ids,
        uint[] amounts,
        uint[] terminationDates
    ) 
        public
    {

    }

}