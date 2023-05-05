// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FCar{

    struct Car{
        uint rarity;
        uint speed;
        uint acceleration;
        uint maniability;
    }

    Car[] cars;

    mapping (uint => address) public carToOwner;
    mapping (address => uint) ownerCarCount;

    uint256 randNonce = 0;

    event NewCar(uint id, uint carDna, uint boosted, uint rarity, string s_rarity, uint speed, uint acceleration, uint maniability);

    function rand(uint _mod) internal returns(uint) {
        randNonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce))) % _mod;
    }

    function newCar() external{
        uint carDna = rand(10**7);
        uint rarity = (carDna / 10**6) % 5;
        uint speed;
        uint acceleration;
        uint maniability;

        cars.push(Car(rarity,speed, acceleration, maniability));
        uint id = cars.length - 1;

        carToOwner[id] = msg.sender;
        ownerCarCount[msg.sender]++;

        uint boosted = rand(3);
        
        string memory s_rarity = "common";
        if(rarity == 0){
            // Common
            speed = 30 + ((carDna / 10**4) % 10**2) % 20;
            acceleration = 30 + ((carDna / 10**2) % 10**2) % 20;
            maniability = 30 + (carDna % 10**2) % 20;
            s_rarity = "Common";
        }else if(rarity == 1){
            // Unommon
            speed = boosted == 0 ? 50 + ((carDna / 10**4) % 10**2) % 15 : 30 + ((carDna / 10**4) % 10**2) % 35;
            acceleration = boosted == 1 ? 50 + ((carDna / 10**2) % 10**2) % 15 : 30 + ((carDna / 10**2) % 10**2) % 35;
            maniability = boosted == 2 ? 50 + (carDna % 10**2) % 15 : 30 + (carDna % 10**2) % 35;
            s_rarity = "Uncommon";
        }else if(rarity == 2){
            // Rare
            speed = boosted == 0 ? 65 + ((carDna / 10**4) % 10**2) % 15 : 50 + ((carDna / 10**4) % 10**2) % 30;
            acceleration = boosted == 1 ? 65 + ((carDna / 10**2) % 10**2) % 15 : 50 + ((carDna / 10**2) % 10**2) % 30;
            maniability = boosted == 2 ? 65 + (carDna % 10**2) % 15 : 50 + (carDna % 10**2) % 30;
            s_rarity = "Rare";
        }else if(rarity == 3){
            // Mythic
            speed = boosted == 0 ? 80 + ((carDna / 10**4) % 10**2) % 10 : 65 + ((carDna / 10**4) % 10**2) % 25;
            acceleration = boosted == 1 ? 80 + ((carDna / 10**2) % 10**2) % 10 : 65 + ((carDna / 10**2) % 10**2) % 25;
            maniability = boosted == 2 ? 80 + (carDna % 10**2) % 10 : 65 + (carDna % 10**2) % 25;
            s_rarity = "Mythic";
        }else if(rarity == 4){
            // Legendary
            speed = boosted == 0 ? 90 + ((carDna / 10**4) % 10**2) % 10 : 80 + ((carDna / 10**4) % 10**2) % 20;
            acceleration = boosted == 1 ? 90 + ((carDna / 10**2) % 10**2) % 10 : 80 + ((carDna / 10**2) % 10**2) % 20;
            maniability = boosted == 2 ? 90 + (carDna % 10**2) % 10 : 80 + (carDna % 10**2) % 20;
            s_rarity = "Legendary";
        }else if(rarity == 4){
            // Relic
            speed = 100;
            acceleration = 100;
            maniability = 100;
            s_rarity = "Relic";
        }

        emit NewCar(id, carDna, boosted, rarity, s_rarity, speed, acceleration, maniability);
    }
}