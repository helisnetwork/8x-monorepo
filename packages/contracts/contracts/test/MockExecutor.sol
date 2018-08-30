pragma solidity 0.4.24;

import "./MockTime.sol";

import "../Executor.sol";
import "../TransferProxy.sol";
import "../StakeContract.sol";
import "../PaymentRegistry.sol";
import "../KyberNetworkInterface.sol";
import "../base/token/WETH.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockExecutor is Executor, MockTime {

    constructor(
            address _transferProxyAddress,
            address _stakeContractAddress,
            address _paymentRegistryAddress,
            address _approvedRegistryAddress,
            address _requirementsAddress,
            uint _lockUpPercentage,
            uint _divisor
        )
        Executor(
          _transferProxyAddress,
          _stakeContractAddress,
          _paymentRegistryAddress,
          _approvedRegistryAddress,
          _requirementsAddress,
          _lockUpPercentage,
          _divisor
        )
        MockTime()
        public
    { }

}