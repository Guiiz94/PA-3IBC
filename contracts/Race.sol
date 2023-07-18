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
    uint256 public racePrice;
    uint256 public raceFee = 10;

    struct Bet {
        address bettor; // Celui qui fait le pari
        uint256 amount; // Le montant du pari
        uint256 carId; // L'ID de la voiture sur laquelle le pari est placé
    }

    Bet[] public bets;

    event Win(address _winner);

    constructor(address _nftCarAddress, address _fCarTokenAddress) {
        nftCar = NFTCar(_nftCarAddress);
        fcarToken = FCarToken(_fCarTokenAddress);
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
        require(ERC20(fcarToken).balanceOf(msg.sender) > raceFee, "Not enough token");

        RaceEntry memory newEntry = RaceEntry({
            tokenId: _tokenId,
            owner: msg.sender,
            speed: _speed,
            acceleration: _acceleration,
            maniability: _maniability
        });

        require(!carInRace(_tokenId),"Already in a race");

        ERC20(fcarToken).transferFrom(msg.sender,address(this),raceFee);

        racePrice += raceFee;

        // Ajoutez le NFT à la course

        raceEntries.push(newEntry);
    }

    function runRace() public returns (address) {
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

        // ID du vainqueur
        uint256 winner = raceEntries[winnerIndex].tokenId;
        // Reset du tableau
        delete raceEntries;
        // DIstributuon des gains
        distributeWinnings(winner);
        racePrice = 0;
        // Renvoyez l'ID du token du vainqueur
        emit Win(nftCar.ownerOf(winner));
        address winnerAddress = nftCar.ownerOf(winner);
        return winnerAddress;
    }

    function carInRace(uint256 _carId) public view returns (bool) {
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

        uint256 amount = (_amount * 90) / 100;

        // Ajoutez le pari à la liste des paris
        bets.push(Bet({bettor: msg.sender, amount: amount, carId: _carId}));
    }

    function distributeWinnings(uint256 _winningCarId) public {
        uint256 totalBetAmount = 0;
        uint256 totalWinningAmount = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].carId == _winningCarId) {
                totalBetAmount += bets[i].amount;
            }
            totalWinningAmount += bets[i].amount;
        }

        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].carId == _winningCarId) {
                uint256 winnings = (bets[i].amount / totalBetAmount) *
                    totalWinningAmount;
                ERC20(fcarToken).transfer(bets[i].bettor, winnings);
            }
        }
        
        uint256 winningsAmount = (racePrice * 85) / 100;
        ERC20(fcarToken).transfer(nftCar.ownerOf(_winningCarId), winningsAmount);


        // Réinitialisez les paris pour la prochaine course
        delete bets;
    }

    // pour récupérer les voitures en liste pour la course
    function getRaceEntries() public view returns (RaceEntry[] memory) {
        return raceEntries;
    }

    // pour récupérer les différents paris
    function getBets() public view returns (Bet[] memory) {
        return bets;
    }
}
