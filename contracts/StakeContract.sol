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

    event Locked(address staker, address tokenAddress, uint amount);
    event Unlocked(address staker, address tokenAddress, uint amount);
    event Slashed(address staker, address tokenAddress, uint amount);
    event Transferred(address staker, address tokenAddress, uint amount, address destination);
    event ToppedUp(address staker, address tokenAddress, uint amount);
    event Withdrew(address staker, address tokenAddress, uint amount);

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
    function lockTokens(address _staker, address _tokenAddress, uint _amount)
        public
        onlyAuthorized
    {
        require(getAvailableStake(_staker, _tokenAddress) >= _amount);
        stakes[_staker][_tokenAddress].lockedUp += _amount;

        emit Locked(_staker, _tokenAddress, _amount);
    }

    /** @dev When a processor executes a transaction their tokens are unstaked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _tokenAddress token for which to stake for.
      * @param _amount is how much they would like to unstake;
    */
    function unlockTokens(address _staker, address _tokenAddress, uint _amount)
        public
        onlyAuthorized
    {
        // Ensure that they can't unstake more than they actually have
        require(stakes[_staker][_tokenAddress].lockedUp >= _amount);
        stakes[_staker][_tokenAddress].lockedUp -= _amount;

        emit Unlocked(_staker, _tokenAddress, _amount);
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

        emit Slashed(_staker, _tokenAddress, _amount);
    }

    /** @dev When someone catches out another user for not processing
      * their tokens are transferred to them.
      * @param _staker is the processors who's tokens need to be slashed.
      * @param _tokenAddress token for which to stake for.
      * @param _amount is how many tokens need to be slashed.
      * @param _destination is the person to transfer the stake to.
    */
    function transferStake(address _staker, address _tokenAddress, uint _amount, address _destination)
        public
        onlyAuthorized
    {
        // Make sure that an authorized address can't slash more tokens than
        // they actually have locked up.
        require(stakes[_staker][_tokenAddress].lockedUp >= _amount);

        // Reduce the total amount first
        stakes[_staker][_tokenAddress].total -= _amount;
        stakes[_staker][_tokenAddress].lockedUp -= _amount;

        // Transfer the stake
        stakes[_destination][_tokenAddress].total += _amount;

        emit Transferred(_staker, _tokenAddress, _amount, _destination);
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

        emit ToppedUp(msg.sender, _tokenAddress, _amount);
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

        emit Withdrew(msg.sender, _tokenAddress, _amount);
    }

}