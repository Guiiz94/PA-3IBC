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

    event NewCar(uint id, uint carDna, uint boostCount, uint[] boosted, uint rarity, string s_rarity, uint speed, uint acceleration, uint maniability);

    function rand(uint _mod) internal returns(uint) {
        randNonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce))) % _mod;
    }

    function contain(uint[] memory _arr, uint _value) internal pure returns(bool){
        for(uint i = 0; i < _arr.length; i++){
            if(_arr[i] == _value) return true;
        }
        return false;
    }

    function newCar() external{
        uint carDna = rand(10**7);
        uint rarity = (carDna / 10**6) % 6;
        uint speed;
        uint acceleration;
        uint maniability;

        cars.push(Car(rarity,speed, acceleration, maniability));
        uint id = cars.length - 1;

        carToOwner[id] = msg.sender;
        ownerCarCount[msg.sender]++;

        uint boostCount = rand(3);
        uint[] memory boostind = new uint[](boostCount);

        for(uint i = 0; i < boostCount; i ++){
            uint boosted;
            do{
                boosted = rand(3);
            }while(contain(boostind, boosted));
            boostind[i] = boosted;
        }

        
        
        string memory s_rarity = "common";
        if(rarity == 0){
            // Common
            speed = 30 + ((carDna / 10**4) % 10**2) % 20;
            acceleration = 30 + ((carDna / 10**2) % 10**2) % 20;
            maniability = 30 + (carDna % 10**2) % 20;
            s_rarity = "Common";
        }else if(rarity == 1){
            // Unommon
            speed = contain(boostind, 0) ? 50 + ((carDna / 10**4) % 10**2) % 15 : 30 + ((carDna / 10**4) % 10**2) % 35;
            acceleration = contain(boostind, 1) ? 50 + ((carDna / 10**2) % 10**2) % 15 : 30 + ((carDna / 10**2) % 10**2) % 35;
            maniability = contain(boostind, 2) ? 50 + (carDna % 10**2) % 15 : 30 + (carDna % 10**2) % 35;
            s_rarity = "Uncommon";
        }else if(rarity == 2){
            // Rare
            speed = contain(boostind, 0) ? 65 + ((carDna / 10**4) % 10**2) % 15 : 50 + ((carDna / 10**4) % 10**2) % 30;
            acceleration = contain(boostind, 1) ? 65 + ((carDna / 10**2) % 10**2) % 15 : 50 + ((carDna / 10**2) % 10**2) % 30;
            maniability = contain(boostind, 2) ? 65 + (carDna % 10**2) % 15 : 50 + (carDna % 10**2) % 30;
            s_rarity = "Rare";
        }else if(rarity == 3){
            // Mythic
            speed = contain(boostind, 0) ? 80 + ((carDna / 10**4) % 10**2) % 10 : 65 + ((carDna / 10**4) % 10**2) % 25;
            acceleration = contain(boostind, 1) ? 80 + ((carDna / 10**2) % 10**2) % 10 : 65 + ((carDna / 10**2) % 10**2) % 25;
            maniability = contain(boostind, 2) ? 80 + (carDna % 10**2) % 10 : 65 + (carDna % 10**2) % 25;
            s_rarity = "Mythic";
        }else if(rarity == 4){
            // Legendary
            speed = contain(boostind, 0) ? 90 + ((carDna / 10**4) % 10**2) % 10 : 80 + ((carDna / 10**4) % 10**2) % 20;
            acceleration = contain(boostind, 1) ? 90 + ((carDna / 10**2) % 10**2) % 10 : 80 + ((carDna / 10**2) % 10**2) % 20;
            maniability = contain(boostind, 2) ? 90 + (carDna % 10**2) % 10 : 80 + (carDna % 10**2) % 20;
            s_rarity = "Legendary";
        }else if(rarity == 5){
            // Relic
            speed = 100;
            acceleration = 100;
            maniability = 100;
            s_rarity = "Relic";
        }

        emit NewCar(id, carDna, boostCount, boostind, rarity, s_rarity, speed, acceleration, maniability);
    }
}