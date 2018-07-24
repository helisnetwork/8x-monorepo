pragma solidity 0.4.24;

import "./MockTime.sol";

import "../Executor.sol";
import "../TransferProxy.sol";
import "../StakeContract.sol";
import "../PaymentRegistry.sol";
import "../KyberNetworkInterface.sol";

/** @title Mock contract in order to test time logic reliably. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockExecutor is Executor, MockTime {

    constructor(
            address _transferProxyAddress,
            address _stakeContractAddress,
            address _paymentRegistryAddress,
            address _wrappedEtherAddress,
            address _kyberAddress
        )
        Executor(
          _transferProxyAddress,
          _stakeContractAddress,
          _paymentRegistryAddress,
          _wrappedEtherAddress,
          _kyberAddress
        )
        MockTime()
        public
    {
        // @TODO: Figure out how to add tests for this

        transferProxy = TransferProxy(_transferProxyAddress);
        stakeContract = StakeContract(_stakeContractAddress);
        paymentRegistry = PaymentRegistry(_paymentRegistryAddress);
        wrappedEther = ERC20(_wrappedEtherAddress);
        kyberProxy = KyberNetworkInterface(_kyberAddress);
    }

}