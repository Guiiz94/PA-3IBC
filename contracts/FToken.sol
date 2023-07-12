//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./FCar.sol";

// This is the main building block for smart contracts.
contract FToken is FCar {
    // Some string type variables to identify the token.
    string public name = "F-Race Token";
    string public symbol = "FRT";

    // The fixed amount of tokens, stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    // address public owner;

    // A mapping is a key/value map. Here we store each account's balance.
    mapping(address => uint256) balances;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    /**
     * Contract initialization.
     */
    constructor() {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from *outside*
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        console.log(
        "Transferring from %s to %s %s tokens",
        msg.sender,
        to,
        amount
    );

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function generateBooster(uint8 rarity) external payable{
        uint16 price = prices[rarity];
        require(balances[msg.sender] >= price);

        console.log(
            "%s buying %s booster for %s tokens",
            msg.sender,
            _getRarity(rarity),
            price
        );

        balances[msg.sender] -= price;
        balances[address(this)] += price;

        _generateBooster(rarity);
    }

    function resetCooldown(uint id) external payable{
        require(balances[msg.sender] >= 10, "Not enough tokens");

        console.log(
            "%s buying cooldown for %s tokens (%s)",
            msg.sender,
            10,
            address(this)
        );

        // Transfer the amount.
        balances[msg.sender] -= 10;
        balances[address(this)] += 10;

        _resetCooldown(id, msg.sender);

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, owner, 10);
    }


    // Structure pour représenter une enchère
    struct Enchere {
        bool termine;
        address meilleurAcheteur;
        uint256 meilleureOffre;
        uint256 finEnchere;
    }

    // Mapping de voiture à enchère
    mapping(uint => Enchere) public encheres;

    // Event pour une nouvelle meilleure offre
    event NouvelleMeilleureOffre(uint idVoiture, address acheteur, uint montant);

    // Event pour une enchère terminée
    event EnchereTerminee(uint idVoiture, address gagnant, uint montant);

    // Tableau pour garder une trace de toutes les voitures disponibles pour les enchères
    uint[] public voituresEncheres;

    // Fonction pour commencer une enchère
    function commencerEnchere(uint idVoiture, uint prix) external {
        require(carToOwner[idVoiture] == msg.sender, "Vous ne possedez pas cette voiture.");

        encheres[idVoiture] = Enchere({
            termine: false,
            meilleurAcheteur: address(0),
            meilleureOffre: 0,
            //temps enchere
            finEnchere: block.timestamp + 1 days 
        });

        // Ajouter la voiture à la liste des voitures disponibles pour les enchères
        voituresEncheres.push(idVoiture);
    }

    // Fonction pour obtenir toutes les voitures disponibles pour les enchères
    function obtenirVoituresEncheres() public view returns (uint[] memory) {
        return voituresEncheres;
    }

    

     

    
}