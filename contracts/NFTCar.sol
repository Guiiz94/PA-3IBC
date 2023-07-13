// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./FCarToken.sol";
import "./NFTCarFactory.sol";

contract NFTCar is ERC721URIStorage, Ownable, NFTCarFactory{
    
    mapping(uint256 => address) nftToOwner;
    mapping(address => uint256) ownerNftCount;
    mapping(address => uint256[]) userNfts;

    uint256 randNonce;
    uint256 nftId;
    address fcarToken;

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


    // Structure pour représenter une enchère

    struct Enchere {
        bool termine;
        address meilleurAcheteur;
        uint256 meilleureOffre;
        uint256 finEnchere;
        address[] beter;
        uint256[] amount;
    }

    // Mapping de voiture à enchère
    mapping(uint => Enchere) public encheres;

    // Event pour une nouvelle meilleure offre
    event NouvelleMeilleureOffre(uint idVoiture, address acheteur, uint montant);

    // Event pour une enchère terminée
    event EnchereTerminee(uint idVoiture, address gagnant, uint montant);

    // Tableau pour garder une trace de toutes les voitures disponibles pour les enchères
    uint[] voituresEncheresActives;
    Enchere[] voituresEncheresTerminees;

    // Fonction pour commencer une enchère
    function commencerEnchere(uint idVoiture, uint prix, address seller) external {
        require(nftToOwner[idVoiture] == seller, "Vous ne possedez pas cette voiture.");
        require(_indexOf(idVoiture) == voituresEncheresActives.length, "Cette voiture est deja en vente");

        encheres[idVoiture] = Enchere({
            termine: false,
            meilleurAcheteur: address(0),
            meilleureOffre: prix,
            //temps enchere
            // finEnchere: block.timestamp + 1 days,
            finEnchere: block.timestamp + 1 minutes,
            beter: new address[](0),
            amount: new uint256[](0)
        });

        // Ajouter la voiture à la liste des voitures disponibles pour les enchères
        voituresEncheresActives.push(idVoiture);
        uint256 index = _indexInNfts(idVoiture, seller);
        uint256[] storage userNftArray = userNfts[seller];
        uint256 i;
        for(i = index; i < userNftArray.length - 1; i++){
            userNftArray[i] = userNftArray[i-1];
        }
        userNftArray.pop();
    } 

    function _indexOf(uint256 _id) internal view returns(uint256){
        for(uint256 index = 0; index < voituresEncheresActives.length; index ++){
            if(voituresEncheresActives[index] == _id) return index;
        }
        return voituresEncheresActives.length;
    }

    function _indexInNfts(uint256 _id, address _owner) internal view returns(uint256){
        for(uint256 index = 0; index < userNfts[_owner].length; index ++){
            if(userNfts[_owner][index] == _id) return index;
        }
        return userNfts[_owner].length;
    }

    function _getBet(Enchere memory _enchere, address _beter) internal pure returns(uint256){
        for(uint256 i = 0; i < _enchere.beter.length;i++){
            if(_beter == _enchere.beter[i])return i;
        }
        return _enchere.beter.length;
    }

    // Fonction pour faire une offre
    function faireOffre(uint idNFT, uint montant) external {
        Enchere storage enchere = encheres[idNFT];
        uint256 currentMontant = 0;
        uint256 index = _getBet(enchere, msg.sender);
        if(index != enchere.beter.length){
            currentMontant = enchere.amount[index];
        }

        require(block.timestamp <= enchere.finEnchere, "Auction has ended.");
        require(montant + currentMontant > enchere.meilleureOffre, "There is already a higher bid.");
        require(ERC20(fcarToken).balanceOf(msg.sender) >= montant, "Insufficient FRT balance");


        // if (enchere.meilleureOffre != 0) {
        //     // Refund the previous bid
        //     _transfer(address(this), enchere.meilleurAcheteur, enchere.meilleureOffre);
        // }

        // Transfer the bid from the buyer to the contract
        // _transfer(msg.sender, address(this), montant);
        ERC20(fcarToken).transferFrom(msg.sender, address(this), montant);

        if(index != enchere.beter.length){
            enchere.amount[index] += montant;
        }else{
            enchere.beter.push(msg.sender);
            enchere.amount.push(montant);
        }

        // Update the auction
        enchere.meilleurAcheteur = msg.sender;
        enchere.meilleureOffre = montant + currentMontant;

        emit NouvelleMeilleureOffre(idNFT, msg.sender, montant + currentMontant);
    }

    // Fonction pour terminer une enchère
    function terminerEnchere(uint idNFT) internal {
        Enchere storage enchere = encheres[idNFT];

        require(block.timestamp >= enchere.finEnchere, "L'enchere n'est pas encore terminee.");
        require(!enchere.termine, "L'enchere a deja ete reglee.");

        enchere.termine = true;
        emit EnchereTerminee(idNFT, enchere.meilleurAcheteur, enchere.meilleureOffre);

        // Transférer l'offre au propriétaire
        // payable(ownerOf(idNFT)).transfer(enchere.meilleureOffre);
        require(enchere.meilleureOffre <=  ERC20(fcarToken).balanceOf(address(this)), "Insufficient token balance");
        ERC20(fcarToken).transfer(ownerOf(idNFT), enchere.meilleureOffre);

        // Transférer le NFT au gagnant
        nftToOwner[idNFT] = enchere.meilleurAcheteur;
        ownerNftCount[ownerOf(idNFT)]-=1;
        ownerNftCount[enchere.meilleurAcheteur]+=1;
        // delete userNfts[ownerOf(idNFT)][_indexInNfts(idNFT,ownerOf(idNFT))];
        // uint256 index = _indexInNfts(idNFT, ownerOf(idNFT));
        // uint256[] storage userNftArray = userNfts[ownerOf(idNFT)];
        // uint256 i;
        // for(i = index; i < userNftArray.length - 1; i++){
        //     userNftArray[i] = userNftArray[i-1];
        // }
        // userNftArray.pop();
        userNfts[enchere.meilleurAcheteur].push(idNFT);
        _transfer(ownerOf(idNFT), enchere.meilleurAcheteur, idNFT);


        
        // delete voituresEncheresActives[_indexOf(idNFT)];
        uint256 index = _indexOf(idNFT);
        uint256 i;
        for(i = index; i < voituresEncheresActives.length - 1; i++){
            voituresEncheresActives[i] = voituresEncheresActives[i-1];
        }
        voituresEncheresActives.pop();
        voituresEncheresTerminees.push(enchere);

        // Remboursement
        for(i = 0; i < enchere.beter.length; i++){
            if(enchere.beter[i] != enchere.meilleurAcheteur) ERC20(fcarToken).transfer(enchere.beter[i], enchere.amount[i]);
        }
    }

    function endAuctions() external {
        Enchere storage enchere;
        for(uint256 i = 0; i < voituresEncheresActives.length; i++){
            enchere = encheres[voituresEncheresActives[i]];
            if(enchere.finEnchere <= block.timestamp)terminerEnchere(voituresEncheresActives[i]);
        }
    }

    function getActiveAuctions() public view returns (Enchere[] memory) {
        Enchere[] memory activeAuctions = new Enchere[](voituresEncheresActives.length);
        for (uint i = 0; i < voituresEncheresActives.length; i++) {
            activeAuctions[i] = encheres[voituresEncheresActives[i]];
        }
        return activeAuctions;
    }

    constructor(address _fcarToken) ERC721("NFTCar", "NFTCAR") {
        fcarToken = _fcarToken;
        nftId = 0;
        randNonce = 0;
    }
}