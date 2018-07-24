pragma solidity 0.4.24;

import "./base/token/ERC20.sol";

/** @title Kyber Network interface */

interface KyberNetworkProxyInterface {

    /**
      * PUBLIC VIEW FUNCTIONS
    */

    /** @dev Call this function to obtain the freshest conversion rate of a single token pair.
      * @param src source ERC20 token contract address
      * @param dest destination ERC20 token contract address
      * @param srcQty wei amount of source ERC20 token
    */
    function getExpectedRate(
        ERC20 src,
        ERC20 dest,
        uint srcQty
    )
        public
        view
        returns (uint expectedRate, uint slippageRate);

    function maxGasPrice() public view returns(uint);

    function getUserCapInWei(address user) public view returns(uint);

    function getUserCapInTokenWei(address user, ERC20 token) public view returns(uint);

    function enabled() public view returns(bool);

    function info(bytes32 id) public view returns(uint);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @notice use token address ETH_TOKEN_ADDRESS for ether
      * @dev makes a trade between src and dest token and send dest token to destAddress
      * @param src Src token
      * @param srcAmount amount of src tokens
      * @param dest Destination token
      * @param destAddress Address to send tokens to
      * @param maxDestAmount A limit on the amount of dest tokens
      * @param minConversionRate The minimal conversion rate. If actual rate is lower, trade is canceled.
      * @param walletId is the wallet ID to send part of the fees
      * @param hint will give hints for the trade.
      * @return amount of actual dest tokens
    */
    function tradeWithHint(
        ERC20 src,
        uint srcAmount,
        ERC20 dest,
        address destAddress,
        uint maxDestAmount,
        uint minConversionRate,
        address walletId,
        bytes hint
    )
        public
        payable
        returns(uint);

}