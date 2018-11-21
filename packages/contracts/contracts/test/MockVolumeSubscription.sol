pragma solidity 0.4.24;

import "./MockTime.sol";
import "../subscriptions/VolumeSubscription.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockVolumeSubscription is VolumeSubscription, MockTime {

    constructor(address _approvedRegistryAddress) VolumeSubscription(_approvedRegistryAddress) { }

}