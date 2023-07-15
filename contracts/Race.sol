// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./NFTCar.sol";
import "./FCarToken.sol";

contract Race {
    NFTCar private nftCar;
    FCarToken private fcarToken;

    struct RaceEntry {
        uint256 tokenId;
        address owner;
        uint8 speed;
        uint8 acceleration;
        uint8 maniability;
    }

    RaceEntry[] public raceEntries;

    struct Bet {
        address bettor; // Celui qui fait le pari
        uint256 amount; // Le montant du pari
        uint256 carId; // L'ID de la voiture sur laquelle le pari est placé
    }

    Bet[] public bets;

    constructor(address _nftCarAddress) {
        nftCar = NFTCar(_nftCarAddress);
    }

    function enterRace(
        uint256 _tokenId,
        uint8 _speed,
        uint8 _acceleration,
        uint8 _maniability
    ) public {
        // Vérifiez que l'appelant est le propriétaire du NFT
        require(
            nftCar.ownerOf(_tokenId) == msg.sender,
            "Vous devez etre le proprietaire du NFT pour entrer dans la course"
        );

        // Ajoutez le NFT à la course
        RaceEntry memory newEntry = RaceEntry({
            tokenId: _tokenId,
            owner: msg.sender,
            speed: _speed,
            acceleration: _acceleration,
            maniability: _maniability
        });

        raceEntries.push(newEntry);
    }

    function runRace() public returns (uint256) {
        // Vérifiez qu'il y a des entrées dans la course
        require(
            raceEntries.length > 0,
            "Il n'y a pas d'entrees dans la course"
        );

        // Générez la course en fonction des statistique de chaque voiture avec un algo
        uint256 winnerIndex = 0;
        uint256 highestScore = 0;

        for (uint256 i = 0; i < raceEntries.length; i++) {
            uint256 score = raceEntries[i].speed +
                raceEntries[i].acceleration +
                raceEntries[i].maniability;
            if (score > highestScore) {
                highestScore = score;
                winnerIndex = i;
            }
        }

        // Renvoyez l'ID du token du vainqueur
        distributeWinnings(raceEntries[winnerIndex].tokenId);
        return raceEntries[winnerIndex].tokenId;
    }

    function carInRace(uint256 _carId) internal view returns (bool) {
        for (uint256 i = 0; i < raceEntries.length; i++) {
            if (raceEntries[i].tokenId == _carId) {
                return true;
            }
        }
        return false;
    }

    function placeBet(uint256 _carId, uint256 _amount) public {
        // Vérifiez que la voiture est dans la course
        require(
            carInRace(_carId),
            "Cette voiture ne participe pas a la course"
        );

        // Transférez les tokens du parieur au contrat
        ERC20(fcarToken).transferFrom(msg.sender, address(this), _amount);

        // Ajoutez le pari à la liste des paris
        bets.push(Bet({bettor: msg.sender, amount: _amount, carId: _carId}));
    }

    function distributeWinnings(uint256 _winningCarId) internal {
        uint256 totalBetAmount = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].carId == _winningCarId) {
                totalBetAmount += bets[i].amount;
            }
        }

        uint256 commission = address(this).balance / 10; // Calcul de la commission de 10%
        uint256 winningsPool = address(this).balance - commission; // Le pool de gains est le solde du contrat moins la commission

        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].carId == _winningCarId) {
                uint256 winnings = (bets[i].amount / totalBetAmount) *
                    winningsPool;
                ERC20(fcarToken).transfer(bets[i].bettor, winnings);
            }
        }

        // Réinitialisez les paris pour la prochaine course
        delete bets;
    }
}
