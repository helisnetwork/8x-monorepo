pragma solidity 0.4.24;

import "./Authorizable.sol";
import "./EightExToken.sol";
import "./base/math/SafeMath.sol";

/** @title Stake Contract - Processors stake tokens to claim transactions */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract StakeContract is Authorizable {

    using SafeMath for uint;

    struct Stake {
        uint lockedUp;
        uint total;
    }

    mapping (address => Stake) public stakes;

    EightExToken public tokenContract;

    /**
      * PUBLIC FUNCTIONS
    */
    constructor(address _tokenAddress) public {
        tokenContract = EightExToken(_tokenAddress);
    }

    /** @dev When the processor claims a transaction their tokens are staked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _amount is how much they would like to stake;
    */
    function stakeTokens(address _staker, uint _amount)
        public
        onlyAuthorized
    {
        require(getAvailableStake(_staker) >= _amount);
        stakes[_staker].lockedUp += _amount;

    }

    /** @dev When a processor executes a transaction their tokens are unstaked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _amount is how much they would like to unstake;
    */
    function unstakeTokens(address _staker, uint _amount)
        public
        onlyAuthorized
    {

        // Ensure that they can't unstake more than they actually have
        require(stakes[_staker].lockedUp >= _amount);
        stakes[_staker].lockedUp -= _amount;

    }

    /** @dev When the processor doesn't execute a transaction they claimed
      * their tokens are slashed.
      * @param _staker is the processors who's tokens need to be slashed.
      * @param _amount is how many tokens need to be slashed.
    */
    function slashTokens(address _staker, uint _amount)
        public
        onlyAuthorized
    {
        // Make sure that an authorized address can't slash more tokens than
        // they actually have locked up.
        require(stakes[_staker].lockedUp >= _amount);

        // Reduce the total amount first
        stakes[_staker].total -= _amount;
        stakes[_staker].lockedUp -= _amount;

        // @TODO: Actually slash the tokens somehow?

    }

    /** @dev Check how many tokens the processor has available at this moment.
      * @param _staker is the processor address.
    */
    function getAvailableStake(address _staker)
        public
        view
        returns (uint available)
    {

        return (stakes[_staker].total - stakes[_staker].lockedUp);

    }

    // @TODO: Try to use ERC223 or something instead.
    /** @dev Top up your stake once you've given approval to transfer funds.
      * @param _amount is how much you would like to withdraw.
    */
    function topUpStake(uint _amount)
        public
        returns (bool success)
    {
        if (tokenContract.transferFrom(msg.sender, address(this), _amount)) {
            stakes[msg.sender].total += _amount;
            return true;
        } else {
            return false;
        }
    }

    /** @dev Withdraw your stake from the stake contract.
      * @param _amount is how much you would like to withdraw.
    */
    function withdrawStake(uint _amount)
        public
    {

        // Check that they're not taking out more than they actually have.
        require(getAvailableStake(msg.sender) >= _amount);

        stakes[msg.sender].total -= _amount;
        tokenContract.transfer(msg.sender, _amount);

    }

}