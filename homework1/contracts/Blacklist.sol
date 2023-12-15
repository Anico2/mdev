// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBlacklist.sol";
contract Blacklist is Ownable, IBlacklist{

    mapping (address => bool) public isBlackListed;
    mapping (address => bool) public allowedTokens;

    event DestroyedBlackFunds(address _blackListedUser, uint _balance);

    event AddedBlackList(address _user);

    event RemovedBlackList(address _user);

    constructor () {}

    function allowedToken(address token) external onlyOwner{
        if (token == address(0)){
            revert();
        }
        allowedTokens[token] = true;

    }

    function getBlackListStatus(address _maker) external view returns (bool) {
        return isBlackListed[_maker];
    }

    // function getOwner() external returns (address) {
    //     return owner;
    // }

    
    
    function addBlackList (address _evilUser, address token) external {
        if (!allowedTokens[token]){
            revert();
        }
        isBlackListed[_evilUser] = true;
        emit AddedBlackList(_evilUser);
    }

    function removeBlackList (address _clearedUser, address token) external  {
        if (!allowedTokens[token]){
            revert();
        }
        isBlackListed[_clearedUser] = false;
        emit RemovedBlackList(_clearedUser);
    }

    // function destroyBlackFunds (address _blackListedUser) public onlyOwner {
    //     require(isBlackListed[_blackListedUser]);
    //     uint dirtyFunds = balanceOf(_blackListedUser);
    //     balances[_blackListedUser] = 0;
    //     _totalSupply -= dirtyFunds;
    //     emit DestroyedBlackFunds(_blackListedUser, dirtyFunds);
    // }

    

}