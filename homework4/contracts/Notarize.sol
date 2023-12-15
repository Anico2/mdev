// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";


contract Notarize is OwnableUpgradeable, AccessControlEnumerableUpgradeable {

    using CountersUpgradeable for CountersUpgradeable.Counter;

    //Create a new role identifier fot the hasher writer role
    bytes32 public constant HASH_WRITER = keccak256("HASH_WRITER");

    CountersUpgradeable.Counter private _docCounter;
    mapping(uint256 => Doc) private _documents;
    mapping(bytes32 => bool) private _regHashes;

    

    struct Doc {
        string docUrl; //Uri of the document that exists off-chain
        bytes32 docHash; //Hash of the document
    }

    CountersUpgradeable.Counter public getInfoCounter;

    event DocHashAdded(uint256 indexed docCounter, string docUrl, bytes32 docHash);
    //error hashAlreadyNotarized();
    //with modifier "initializer" we can call initialize function only once
    function initialize() external initializer {
        __Ownable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }


    function setHashWriterRole(address _hashWriter) external onlyRole(DEFAULT_ADMIN_ROLE){
        grantRole(HASH_WRITER, _hashWriter);

        }
    /*
    dev set a new document structure to store in the list, 
    queueing it if others exist and incremetning documents counter 
    @param url doc URL
    @param hash bytes32 Hash
    */

    function addNewDocument(string memory _url, bytes32 _hash) external onlyRole(HASH_WRITER) {
        require(!_regHashes [_hash], "Hash already notarized");
        //if (_regHashes [_hash]) {
        //    revert hashAlreadyNotarized();
        //}
        uint256 counter = _docCounter.current();
        _documents [counter] = Doc({docUrl: _url, docHash: _hash}); 
        _regHashes[_hash] = true;
        _docCounter.increment();
        emit DocHashAdded (counter, _url, _hash);
    }
/*    
* @dev get a hash in the _num place
* @param_num uint256 Place of the hash to return
* @return string document URL, bytes32 hash, uint256 datetime
*/

    function getDocInfo(uint256 _num) external view returns (string memory, bytes32){
        require(_num < _docCounter.current(), "requested number does not exist");
        return (_documents [_num].docUrl, _documents [_num].docHash);
    }

    function getDocInfoAndCounter(uint256 _num) external returns (string memory, bytes32){
        getInfoCounter.increment();
        return (_documents [_num].docUrl, _documents [_num].docHash);
    }

    function getDocsCount() external view returns (uint256){
        return _docCounter.current();
    }

    function getRegisteredHash(bytes32 _hash) external view returns (bool){
        return _regHashes[_hash];
    }

    function sayHello() external pure returns (string memory){
        return "Hello";
    }


}