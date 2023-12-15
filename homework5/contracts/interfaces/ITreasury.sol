// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface ITreasury{
    function withdraw(address to, uint256 amount) external;
}