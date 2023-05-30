// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FCar {
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    address public owner;

    struct Car {
        string rarity;
        uint8 speed;
        uint8 acceleration;
        uint8 maniability;
        uint32 readyTime;
    }

    Car[] cars;

    mapping(uint256 => address) public carToOwner;
    mapping(address => uint256) ownerCarCount;
    mapping(address => uint256[]) userCars;

    uint256 randNonce = 0;
    uint32 cooldownTime = 1 days;

    event NewCar(
        uint256 id,
        string s_rarity,
        uint8 speed,
        uint8 acceleration,
        uint8 maniability,
        uint32 readyTime
    );

    function rand(uint256 _mod) internal returns (uint256) {
        randNonce++;
        return uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))
        ) % _mod;
    }

    function generateRandomDna() private returns (uint256) {
        return rand(10**11);
    }

    function contain(uint256[] memory _arr, uint256 _value)
        internal
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < _arr.length; i++) {
            if (_arr[i] == _value) return true;
        }
        return false;
    }

    struct CarStats {
        uint8 speed;
        uint8 acceleration;
        uint8 maniability;
    }

    uint256 constant relicRate = 1; // 1 / 100000 => 0.001%
    uint256 constant legendaryRate = 500; // 500 / 100000 => 0.5%
    uint256 constant mythicRate = 5000; // 8000 / 100000 => 5%
    uint256 constant rareRate = 20000; // 20000 / 100000 => 20%
    uint256 constant uncommonRate = 30000; // 30000 / 100000 => 30%

    function _newCar(uint8 rarity) internal {
        require(rarity >= 0 && rarity <= 6, "Invalid rarity"); // Check if the specified rarity is within valid range (0 to 6)

        uint256 carDna = generateRandomDna();
        uint32 readyTime = uint32(block.timestamp + cooldownTime);
        uint256 boostCount = rand(3);
        uint256[] memory boostind = new uint256[](boostCount);

        for (uint256 i = 0; i < boostCount; i++) {
            uint256 boosted;
            do {
                boosted = rand(3);
            } while (contain(boostind, boosted));
            boostind[i] = boosted;
        }

        string memory s_rarity;
        CarStats memory stats;

        uint256 actualRarity;

        if (rarity == 0) {
            actualRarity = carDna / 10**6; // Random rarity
        } else if (rarity == 1) {
            actualRarity = relicRate; // Relic
        } else if (rarity == 2) {
            actualRarity = legendaryRate; // Legendary
        } else if (rarity == 3) {
            actualRarity = mythicRate; // Mythic
        } else if (rarity == 4) {
            actualRarity = rareRate; // Rare
        } else if (rarity == 5) {
            actualRarity = uncommonRate; // Uncommon
        } else if (rarity == 6) {
            actualRarity = 100000; // Common
        }

        s_rarity = determineRarity(actualRarity);
        stats = determineStats(carDna, actualRarity, boostind);

        cars.push(
            Car(
                s_rarity,
                stats.speed,
                stats.acceleration,
                stats.maniability,
                readyTime
            )
        );
        uint256 id = cars.length - 1;

        carToOwner[id] = msg.sender;
        ownerCarCount[msg.sender]++;
        userCars[msg.sender].push(id);

        emit NewCar(
            id,
            s_rarity,
            stats.speed,
            stats.acceleration,
            stats.maniability,
            readyTime
        );
    }



    function determineStats(
        uint256 carDna,
        uint256 rarity,
        uint256[] memory boostind
    ) private pure returns (CarStats memory) {
        CarStats memory stats;

        if (rarity <= relicRate) {
            stats = CarStats(100, 100, 100);
        } else if (rarity <= legendaryRate) {
            stats.speed = contain(boostind, 0)
                ? uint8(90 + ((carDna / 10**4) % 10**2) % 10)
                : uint8(80 + ((carDna / 10**4) % 10**2) % 20);
            stats.acceleration = contain(boostind, 1)
                ? uint8(90 + ((carDna / 10**2) % 10**2) % 10)
                : uint8(80 + ((carDna / 10**2) % 10**2) % 20);
            stats.maniability = contain(boostind, 2)
                ? uint8(90 + (carDna % 10**2) % 10)
                : uint8(80 + (carDna % 10**2) % 20);
        } else if (rarity <= mythicRate) {
            stats.speed = contain(boostind, 0)
                ? uint8(80 + ((carDna / 10**4) % 10**2) % 10)
                : uint8(65 + ((carDna / 10**4) % 10**2) % 25);
            stats.acceleration = contain(boostind, 1)
                ? uint8(80 + ((carDna / 10**2) % 10**2) % 10)
                : uint8(65 + ((carDna / 10**2) % 10**2) % 25);
            stats.maniability = contain(boostind, 2)
                ? uint8(80 + (carDna % 10**2) % 10)
                : uint8(65 + (carDna % 10**2) % 25);
        } else if (rarity <= rareRate) {
            stats.speed = contain(boostind, 0)
                ? uint8(65 + ((carDna / 10**4) % 10**2) % 15)
                : uint8(50 + ((carDna / 10**4) % 10**2) % 30);
            stats.acceleration = contain(boostind, 1)
                ? uint8(65 + ((carDna / 10**2) % 10**2) % 15)
                : uint8(50 + ((carDna / 10**2) % 10**2) % 30);
            stats.maniability = contain(boostind, 2)
                ? uint8(65 + (carDna % 10**2) % 15)
                : uint8(50 + (carDna % 10**2) % 30);
        } else if (rarity <= uncommonRate) {
            stats.speed = contain(boostind, 0)
                ? uint8(50 + ((carDna / 10**4) % 10**2) % 15)
                : uint8(30 + ((carDna / 10**4) % 10**2) % 20);
            stats.acceleration = contain(boostind, 1)
                ? uint8(50 + ((carDna / 10**2) % 10**2) % 15)
                : uint8(30 + ((carDna / 10**2) % 10**2) % 20);
            stats.maniability = contain(boostind, 2)
                ? uint8(50 + (carDna % 10**2) % 15)
                : uint8(30 + (carDna % 10**2) % 20);
        } else {
            stats.speed = contain(boostind, 0)
                ? uint8(30 + ((carDna / 10**4) % 10**2) % 5)
                : uint8(20 + ((carDna / 10**4) % 10**2) % 10);
            stats.acceleration = contain(boostind, 1)
                ? uint8(30 + ((carDna / 10**2) % 10**2) % 5)
                : uint8(20 + ((carDna / 10**2) % 10**2) % 10);
            stats.maniability = contain(boostind, 2)
                ? uint8(30 + (carDna % 10**2) % 5)
                : uint8(20 + (carDna % 10**2) % 10);
        }

        return stats;
    }

    function determineRarity(uint256 rarity) private pure returns (string memory) {
        if (rarity <= relicRate) {
            return "Relic";
        } else if (rarity <= legendaryRate) {
            return "Legendary";
        } else if (rarity <= mythicRate) {
            return "Mythic";
        } else if (rarity <= rareRate) {
            return "Rare";
        } else if (rarity <= uncommonRate) {
            return "Uncommon";
        } else {
            return "Common";
        }
    }

    function generateBooster(uint8 rarity) external{
        require(rarity >= 0 && rarity <= 3, "Invalid booster type");
        _newCar(rarity + 3);
        for(uint8 i = 0; i < 4; i++)_newCar(0);
    }

    function _triggerCooldown(Car storage _car) internal {
        _car.readyTime = uint32(block.timestamp + cooldownTime);
    }

    function _isReady(Car storage _car) internal view returns (bool) {
        return (_car.readyTime <= uint32(block.timestamp));
    }

    function getUserCars() external view returns(uint[] memory){
        return userCars[msg.sender];
    }

    function getCar(uint id) external view returns(Car memory){
        return cars[id];
    }
}
