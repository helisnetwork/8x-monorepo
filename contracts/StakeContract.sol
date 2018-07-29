pragma solidity 0.4.24;

import "./Authorizable.sol";
import "./EightExToken.sol";
import "./base/math/SafeMath.sol";

/** @title Stake Contract - Processors stake tokens to claim transactions */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract StakeContract is Authorizable {

    using SafeMath for uint;

    struct Stake {
        uint lockedUp;
        uint total;
    }

    mapping (address => mapping (address => Stake)) public stakes;

    EightExToken public tokenContract;

    /**
      * PUBLIC FUNCTIONS
    */
    constructor(address _tokenAddress) public {
        tokenContract = EightExToken(_tokenAddress);
    }

    /** @dev When the processor claims a transaction their tokens are staked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _tokenAddress token for which to stake for.
      * @param _amount is how much they would like to stake;
    */
    function stakeTokens(address _staker, address _tokenAddress, uint _amount)
        public
        onlyAuthorized
    {
        require(getAvailableStake(_staker, _tokenAddress) >= _amount);
        stakes[_staker][_tokenAddress].lockedUp += _amount;

    }

    /** @dev When a processor executes a transaction their tokens are unstaked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _tokenAddress token for which to stake for.
      * @param _amount is how much they would like to unstake;
    */
    function unstakeTokens(address _staker, address _tokenAddress, uint _amount)
        public
        onlyAuthorized
    {
        // Ensure that they can't unstake more than they actually have
        require(stakes[_staker][_tokenAddress].lockedUp >= _amount);
        stakes[_staker][_tokenAddress].lockedUp -= _amount;
    }

    /** @dev When the processor doesn't execute a transaction they claimed
      * their tokens are slashed.
      * @param _staker is the processors who's tokens need to be slashed.
      * @param _tokenAddress token for which to stake for.
      * @param _amount is how many tokens need to be slashed.
    */
    function slashTokens(address _staker, address _tokenAddress, uint _amount)
        public
        onlyAuthorized
    {
        // Make sure that an authorized address can't slash more tokens than
        // they actually have locked up.
        require(stakes[_staker][_tokenAddress].lockedUp >= _amount);

        // Reduce the total amount first
        stakes[_staker][_tokenAddress].total -= _amount;
        stakes[_staker][_tokenAddress].lockedUp -= _amount;

        // @TODO: Actually slash the tokens somehow?
    }

    /** @dev Check how many tokens the processor has in total at this moment.
      * @param _staker is the processor address.
      * @param _tokenAddress token for which to stake for.
    */
    function getTotalStake(address _staker, address _tokenAddress)
        public
        view
        returns (uint total)
    {
        return stakes[_staker][_tokenAddress].total;
    }

    /** @dev Check how many tokens the processor has available at this moment.
      * @param _staker is the processor address.
      * @param _tokenAddress token for which to stake for.
    */
    function getAvailableStake(address _staker, address _tokenAddress)
        public
        view
        returns (uint available)
    {
        return (stakes[_staker][_tokenAddress].total - stakes[_staker][_tokenAddress].lockedUp);
    }

    /** @dev Check how many tokens the processor has locked at this moment.
      * @param _staker is the processor address.
      * @param _tokenAddress token for which to stake for.
    */
    function getLockedStake(address _staker, address _tokenAddress)
        public
        view
        returns (uint locked)
    {
        return stakes[_staker][_tokenAddress].lockedUp;
    }

    // @TODO: Try to use ERC223 or something instead.
    /** @dev Top up your stake once you've given approval to transfer funds.
      * @param _amount is how much you would like to withdraw.
      * @param _tokenAddress token for which to stake for.
    */
    function topUpStake(uint _amount, address _tokenAddress)
        public
        returns (bool success)
    {
        if (tokenContract.transferFrom(msg.sender, address(this), _amount)) {
            stakes[msg.sender][_tokenAddress].total += _amount;
            return true;
        } else {
            return false;
        }
    }

    /** @dev Withdraw your stake from the stake contract.
      * @param _amount is how much you would like to withdraw.
      * @param _tokenAddress token for which to stake for.
    */
    function withdrawStake(uint _amount, address _tokenAddress)
        public
    {
        // Check that they're not taking out more than they actually have.
        require(getAvailableStake(msg.sender, _tokenAddress) >= _amount);

        stakes[msg.sender][_tokenAddress].total -= _amount;
        tokenContract.transfer(msg.sender, _amount);
    }

}