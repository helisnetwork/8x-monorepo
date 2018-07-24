pragma solidity 0.4.24;

import "../KyberNetworkInterface.sol";
import "../base/token/ERC20.sol";

/** @title Mock contract to test Kyber Network proxy interface */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockKyberNetworkInterface {

    /**
      * KYBER NETWORK INTERFACE FUNCTIONS
    */

    function getExpectedRate(
        ERC20 src,
        ERC20 dest,
        uint srcQty
    )
        public
        view
        returns (uint expectedRate, uint slippageRate)
    {
        // 0.002 ETH/USD is the exchange rate we want. Assuming $500 USD/ETH.
        return (10**15, 0);
    }

    function maxGasPrice()
        public
        view
        returns(uint)
    {
        return 0;
    }

    function getUserCapInWei(address user)
        public
        view
        returns(uint)
    {
        return 0;
    }

    function getUserCapInTokenWei(address user, ERC20 token)
        public
        view
        returns(uint)
    {
        return 0;
    }

    function enabled()
        public
        view
        returns(bool)
    {
        return true;
    }

    function info(bytes32 id)
        public
        view
        returns(uint)
    {
        return 0;
    }

    function swapTokenToTokenWithChange (
        ERC20 srcToken,
        uint srcQty,
        ERC20 destToken,
        address destAddress,
        address user,
        uint maxDestQty,
        uint minRate
    )
        public
    {

        require(srcToken.balanceOf(user) >= srcQty);

        srcToken.transferFrom(user, address(this), srcQty);
        destToken.transfer(destAddress, maxDestQty);

    }

}