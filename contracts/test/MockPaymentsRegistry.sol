pragma solidity 0.4.24;

import "./MockTime.sol";
import "../PaymentRegistry.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract MockPaymentRegistry is PaymentRegistry, MockTime { }