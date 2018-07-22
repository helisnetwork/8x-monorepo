pragma solidity 0.4.24;

import "./MockTime.sol";
import "../Executor.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract MockExecutor is Executor, MockTime { }