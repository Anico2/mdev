//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./MyNFTToken.sol";

contract MyNFTTokenFactory is Ownable {
    address[] public nftTokenContracts;
    uint256 public nftTokenCounter;
    mapping(address => bool) public isNftTokenDeployed;

    /**
     * @notice constructor
     */
    constructor() {}

    /**
     * @dev deploy a new ERC712 token contract
     * @param collName name of collection
     * @param collSym symbol of collection
     * @return newNFTToken deployed NFT token contract address
     */
    function deployNewNFTToken(string memory collName, string memory collSym, address creator)
        external onlyOwner returns (address)
    {
        MyNFTToken newNFTToken = new MyNFTToken(collName, collSym);
        newNFTToken.transferOwnership(creator);
        nftTokenContracts.push(address(newNFTToken));
        nftTokenCounter += 1;
        isNftTokenDeployed[address(newNFTToken)] = true;
        return address(newNFTToken);
        
    }

    /**
     * @dev get NFT token contract address by index
     * @param _idx index of NFT token contract
     * @return nftTokenContracts[_idx] address of NFT token contract
     */
    function getNftTokenAddress(uint256 _idx) external view returns (address) {
        require(_idx < nftTokenCounter, "index out of range");
        return nftTokenContracts[_idx];
    }

    /**
     * @dev get deployed NFT token counter
     * @return nftTokenCounter deployed token contract counter
     */
    function getNftTokenCounter() external view returns (uint256) {
        return nftTokenCounter;
    }

    function getNftTokenDeployed(address token) public view returns (bool) {
        return isNftTokenDeployed[token];
    }

    function pauseNFTContract(address _nftToBePaused) external onlyOwner {
        require(getNftTokenDeployed(_nftToBePaused), "NFT token not deployed by this factory");
        IMyNFTToken(_nftToBePaused).pause();
    }

    function unpauseNFTContract(address _nftToBeUnpaused) external onlyOwner {
        require(getNftTokenDeployed(_nftToBeUnpaused), "NFT token not deployed by this factory");
        IMyNFTToken(_nftToBeUnpaused).unpause();
    }




}