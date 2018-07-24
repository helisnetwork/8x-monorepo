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

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Swap one token with another token
      * @param srcToken valid token address
      * @param srcQty in token wei
      * @param destToken valid token address
      * @param destAddress where to send swapped tokens to
    */
    function swapTokenToToken (
        ERC20 srcToken,
        uint srcQty,
        ERC20 destToken,
        address destAddress
    )
        public
    {
        srcToken.transferFrom(msg.sender, address(this), srcQty);

        (uint amount, ) = getExpectedRate(srcToken, destToken, srcQty);
        destToken.transfer(destAddress, srcQty * amount);
    }

}