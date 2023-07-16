// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTCarFactory is Ownable {
    struct NFTCollection {
        string uri;
        uint8[] rarities;
    }

    NFTCollection[] collections;
    
    event CollectionAdded(string uri);
    
    function addCollection(string calldata _uri, string calldata _rarities) external onlyOwner {
        collections.push(NFTCollection(_uri, parseRarities(_rarities)));
        emit CollectionAdded(_uri);
    }
    
    function parseRarities(string calldata _rarities) internal pure returns (uint8[] memory) {
        bytes memory rarityBytes = bytes(_rarities);
        uint8[] memory rarities = new uint8[](rarityBytes.length);
        
        for (uint256 i = 0; i < rarityBytes.length; i++) {
            rarities[i] = uint8(rarityBytes[i]) - 48;
        }
        
        return rarities;
    }
    
    // function getCollections() external view returns (NFTCollection[] memory) {
    //     return collections;
    // }
}
