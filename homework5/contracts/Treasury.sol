// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./interfaces/IErrors.sol";
import "./interfaces/ITreasury.sol";
contract Treasury is IErrors, ITreasury{
    address public owner;
    address public simpleDexAddress;

    constructor(address simpleDEX) {
        if(simpleDEX == address(0)){
            revert invalidAddress();
        }
        owner = msg.sender;
        simpleDexAddress = simpleDEX;
    }

    receive() external payable {
    }

    modifier onlySimpleDEX() {
        require(msg.sender == simpleDexAddress, "Only SimpleDEX can call this function");
        _;
        // if (msg.sender != simpleDexAddress) {
        //     revert notSimpleDex();
        // }
    }

    function withdraw(address to, uint256 amount) external onlySimpleDEX{
        (bool sent, ) = payable(to).call{value: amount}("");
        if (!sent){
            revert ethNotSent();
        }
    }
}