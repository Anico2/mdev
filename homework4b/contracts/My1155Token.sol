//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract My1155Token is ERC1155Supply, Ownable{

    uint256 public constant JokerWater = 1;
    uint256 public constant JokerPalace = 2;
    uint256 public constant JokerColumns = 3;
    uint256 public constant JokerColisseum = 4;
    
    mapping(uint256 => string) private _uris;

    constructor() ERC1155("ipfs://QmTTywPqS9SUAZ8Yw5akWY2q46wcBQ8gvraY7ZTMuPvwbM/{id}.json") {
        _mint(msg.sender, JokerWater, 10, "");
        _mint(msg.sender, JokerPalace, 20, "");
        _mint(msg.sender, JokerColumns, 30, "");
        _mint(msg.sender, JokerColisseum, 5, "");
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function uri(uint256 tokenId) override public view returns (string memory) {
        return _uris[tokenId];
    }

    function setTokenUri(uint256 tokenId, string memory tokenUri) public onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = tokenUri;
    }



}