//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Cats is ERC1155Supply, Ownable {

    uint256 public constant CAT1 = 1;
    uint256 public constant CAT2 = 2;
    uint256 public constant CAT3 = 3;
    uint256 public constant CAT4 = 4;
    uint256 public constant CAT5 = 5;
    uint256 public constant FOOD1 = 6;
    uint256 public constant FOOD2 = 7;

    
    mapping(uint256 => string) public _uris;
    /**
     * @notice contract constructor with ipfs link to metadata
     */
    constructor() ERC1155("ipfs://QmPFLs9GNMeJCEwJaPtA1KvjX8cGGXw62319Mgt1bdwrjg/{id}.json"){

    }

    /**
     * @dev mint a new token id, amount and data
     * @param to recipient address
     * @param id token id
     * @param amount token amount
     * @param data additional data
     */
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) external onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function setTokenUri(uint256 tokenId, string calldata tokenUri) external onlyOwner{
        _uris[tokenId] = tokenUri;
    }

    function getTokenUri(uint256 tokenId) external view returns(string memory){
        return _uris[tokenId];
    }


}