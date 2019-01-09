pragma solidity 0.4.24;

import "../interfaces/KyberNetworkInterface.sol";
import "../base/ownership/Ownable.sol";

/** @title Mock contract to test Kyber Network proxy interface */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract MockKyberNetwork is KyberNetworkInterface, Ownable {

    uint256 public EXPECTED_RATE = 2*10**15;

    function setExpectedRate(uint256 _rate) public onlyOwner {
        EXPECTED_RATE = _rate;
    }

    /**
      * KYBER NETWORK INTERFACE FUNCTIONS
    */

    function getExpectedRate(
        ERC20 src,
        ERC20 dest,
        uint256 srcQty
    )
        public
        view
        returns (uint256 expectedRate, uint256 slippageRate)
    {
        // 0.002 ETH/USD is the exchange rate we want. Assuming $500 USD/ETH.
        return (EXPECTED_RATE, EXPECTED_RATE);
    }

    function maxGasPrice()
        public
        view
        returns(uint256)
    {
        return 0;
    }

    function getUserCapInWei(address user)
        public
        view
        returns(uint256)
    {
        return 0;
    }

    function getUserCapInTokenWei(address user, ERC20 token)
        public
        view
        returns(uint256)
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
        returns(uint256)
    {
        return 0;
    }

    function swapEtherToToken(
        ERC20 token,
        uint256 minConversionRate
    )
        public
        payable
    {

        token.transfer(msg.sender, minConversionRate * msg.value);

    }

    function swapTokenToTokenWithChange (
        ERC20 srcToken,
        uint256 srcQty,
        ERC20 destToken,
        address destAddress,
        address user,
        uint256 maxDestQty,
        uint256 minRate
    )
        public
    {

        require(srcToken.balanceOf(user) >= srcQty);

        srcToken.transferFrom(user, address(this), srcQty);
        destToken.transfer(destAddress, maxDestQty);

    }

}