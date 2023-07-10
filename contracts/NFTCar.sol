// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./FCarToken.sol";

contract NFTCar is ERC721URIStorage, Ownable {
    
    struct NFTCollection {
        string uri;
        uint8[] rarities;
    }

    // struct Card{
    //     uint8 rarity;
    //     uint8 index;
    // }

    NFTCollection[] collections;
    
    mapping(uint256 => address) public nftToOwner;
    mapping(address => uint256) ownerNftCount;
    mapping(address => uint256[]) userNfts;

    uint256 randNonce;
    uint256 nftId;
    address fcarToken;

    event CollectionAdded(string uri);
    event LogS(string message, string value);
    event LogI(string message, uint256 value);
    event Minted(address indexed to, uint256 indexed tokenId, string indexed uri, string index);

    function formatURI(string memory _uri, string memory _index) internal pure returns (string memory) {
        return string(abi.encodePacked(_uri, "/", _index, ".json"));
    }

    function rand(uint256 _mod) internal returns (uint256) {
        randNonce++;
        return uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))
        ) % _mod;
    }

    function mint(uint8 _forcedRarity) external {
        uint256 requiredFrtAmount = 1;
        require(ERC20(fcarToken).balanceOf(msg.sender) >= requiredFrtAmount, "Insufficient FRT balance");
        ERC20(fcarToken).transferFrom(msg.sender, address(this), requiredFrtAmount);

        require(collections.length > 0, "No collections available");
        NFTCollection memory collection = collections[rand(collections.length)];
        require(collection.rarities.length > 0, "Invalid collection length");

        uint256 rarityPercentage;
        uint256 index;

        if (_forcedRarity > 0) {
            // Force a specific rarity
            require(_forcedRarity <= 5, "Invalid forced rarity");

            index = rand(collection.rarities.length);
            while(collection.rarities[index] != _forcedRarity)index = rand(collection.rarities.length);

        } else {
            // Generate random rarity
            rarityPercentage = rand(10000) + 1;

            if (rarityPercentage <= 50) {
                // Legendary (0.5%)
                index = rand(collection.rarities.length);
                while(collection.rarities[index] != 1)index = rand(collection.rarities.length);
            } else if (rarityPercentage <= 550) {
                // Mythic (5%)
                index = rand(collection.rarities.length);
                while(collection.rarities[index] != 2)index = rand(collection.rarities.length);
            } else if (rarityPercentage <= 2550) {
                // Rare (20%)
                index = rand(collection.rarities.length);
                while(collection.rarities[index] != 3)index = rand(collection.rarities.length);
            } else if (rarityPercentage <= 5550) {
                // Uncommon (30%)
                index = rand(collection.rarities.length);
                while(collection.rarities[index] != 4)index = rand(collection.rarities.length);
            } else {
                // Common (44.5%)
                index = rand(collection.rarities.length);
                while(collection.rarities[index] != 5)index = rand(collection.rarities.length);
            }
        }

        string memory indexString = Strings.toString(index + 1);
        string memory uri = collection.uri;

        emit LogS("Collection URI", collection.uri);
        emit LogI("Collection Length", collection.rarities.length);
        emit LogS("Generated Index", indexString);

        _mint(msg.sender, nftId);
        _setTokenURI(nftId, formatURI(uri, indexString));
        emit Minted(msg.sender, nftId, uri, indexString);

        nftToOwner[nftId] = msg.sender;
        ownerNftCount[msg.sender]++;
        userNfts[msg.sender].push(nftId);

        nftId += 1;
    }


    function getUserNFTs() external view returns(uint[] memory){
        return userNfts[msg.sender];
    }

    function mint_forced(uint256 _index) external onlyOwner {
        require(collections.length > 0, "No collections available");
        NFTCollection memory collection = collections[rand(collections.length)];
        require(collection.rarities.length > 0, "Invalid collection length");

        string memory indexString = Strings.toString(_index);
        string memory uri = collection.uri;
        
        emit LogS("Collection URI", collection.uri);
        emit LogI("Collection Length", collection.rarities.length);
        emit LogS("Generated Index", indexString);

        _mint(msg.sender, nftId);
        _setTokenURI(nftId, formatURI(uri, indexString));
        emit Minted(msg.sender, nftId, uri, indexString);
        
        nftId += 1;
    }

    function addCollection(
        string calldata _uri,
        string calldata _rarities
    ) external onlyOwner {
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

    function strlen(string memory s) internal pure returns (uint256) {
        uint256 len;
        uint256 i = 0;
        uint256 bytelength = bytes(s).length;
        for (len = 0; i < bytelength; len++) {
            bytes1 b = bytes(s)[i];
            if (b < 0x80) {
                i += 1;
            } else if (b < 0xE0) {
                i += 2;
            } else if (b < 0xF0) {
                i += 3;
            } else if (b < 0xF8) {
                i += 4;
            } else if (b < 0xFC) {
                i += 5;
            } else {
                i += 6;
            }
        }
        return len;
    } 

    function parseUint8(string memory _value) internal pure returns (uint8) {
        bytes memory valueBytes = bytes(_value);
        uint8 result = 0;
        
        for (uint256 i = 0; i < valueBytes.length; i++) {
            uint8 digit = uint8(valueBytes[i]) - 48;
            if (digit > 9) {
                revert("Invalid uint8 value");
            }
            result = result * 10 + digit;
        }
        
        return result;
    }

    function getCollections() external view returns (NFTCollection[] memory){
        return collections;
    }

    constructor(address _fcarToken) ERC721("NFTCar", "NFTCAR") {
        fcarToken = _fcarToken;
        nftId = 0;
        randNonce = 0;
    }
}
