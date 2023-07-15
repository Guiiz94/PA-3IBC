// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./NFTCar.sol";

contract Race {
    NFTCar private nftCar;

    struct RaceEntry {
        uint256 tokenId;
        address owner;
    }

    RaceEntry[] public raceEntries;

    constructor(address _nftCarAddress) {
        nftCar = NFTCar(_nftCarAddress);
    }

    function enterRace(uint256 _tokenId) public {
        // Vérifiez que l'appelant est le propriétaire du NFT
        require(nftCar.ownerOf(_tokenId) == msg.sender, "Vous devez etre le proprietaire du NFT pour entrer dans la course");

        // Ajoutez le NFT à la course
        RaceEntry memory newEntry = RaceEntry({
            tokenId: _tokenId,
            owner: msg.sender
        });

        raceEntries.push(newEntry);
    }


// A FAIRE / RECUPERER STATS et fonctionnement course ( parie , gain , etc ...)


    function runRace() view public returns (uint256) {
        // Vérifiez qu'il y a des entrées dans la course
        require(raceEntries.length > 0, "Il n'y a pas d'entrees dans la course");

        // Générez un nombre aléatoire basé sur le nombre d'entrées dans la course
        // uint256 winnerIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % raceEntries.length;

        // Renvoyez l'ID du token du vainqueur
        // return raceEntries[winnerIndex].tokenId;
        return 0;
    }
}
