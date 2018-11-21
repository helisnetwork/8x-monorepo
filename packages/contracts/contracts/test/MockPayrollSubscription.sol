pragma solidity 0.4.24;

import "./MockTime.sol";
import "../subscriptions/PayrollSubscription.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockPayrollSubscription is PayrollSubscription, MockTime {

    constructor(address _approvedRegistryAddress) PayrollSubscription(_approvedRegistryAddress) { }

}