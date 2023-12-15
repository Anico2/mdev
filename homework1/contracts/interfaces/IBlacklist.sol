// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;



interface IBlacklist {
    function getBlackListStatus(address _maker) external view returns (bool);
    function addBlackList (address _evilUser, address token) external ;
    function removeBlackList (address _clearedUser, address token) external;


}