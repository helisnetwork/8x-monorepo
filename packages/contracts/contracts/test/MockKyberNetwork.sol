pragma solidity 0.4.24;

import "../interfaces/KyberNetworkInterface.sol";
import "../base/ownership/Ownable.sol";

/** @title Mock contract to test Kyber Network proxy interface */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockKyberNetwork is KyberNetworkInterface, Ownable {

    uint public EXPECTED_RATE = 2*10**15;

    function setExpectedRate(uint _rate) public onlyOwner {
        EXPECTED_RATE = _rate;
    }


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
        return (EXPECTED_RATE, EXPECTED_RATE);
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

    function swapEtherToToken(
        ERC20 token,
        uint minConversionRate
    )
        public
        payable
    {

        token.transfer(msg.sender, minConversionRate * msg.value);

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