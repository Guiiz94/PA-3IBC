import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AuctionComponent = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [currentBalance, setCurrentBalance] = useState(0);
    const [tokenContract, setTokenContract] = useState(null);
    const [highestBid, setHighestBid] = useState(0);
    const [highestBidder, setHighestBidder] = useState('');
    const [bidValue, setBidValue] = useState('');
    const [voituresEncheres, setVoituresEncheres] = useState([]);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            setCurrentAccount(accounts[0]);

            const tokenAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Remplacer par l'adresse du contrat
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
            setTokenContract(tokenContract);

            const highestBid = await tokenContract.meilleureOffre();
            const highestBidder = await tokenContract.meilleurAcheteur();
            setHighestBid(ethers.utils.formatEther(highestBid));
            setHighestBidder(highestBidder);

            const activeAuctions = await tokenContract.getActiveAuctions();
            setVoituresEncheres(activeAuctions);
        } else {
            console.error("Ethereum is not connected");
        }

        const voituresEncheres = await tokenContract.obtenirVoituresEncheres();
        setVoituresEncheres(voituresEncheres);
    };

    const faireOffre = async (idVoiture) => {
        if (tokenContract && bidValue) {
            try {
                const tx = await tokenContract.faireOffre(idVoiture, ethers.utils.parseEther(bidValue));
                await tx.wait();
                loadBlockchainData();
            } catch (error) {
                console.error("Error while bidding:", error);
            }
        }
    };
    
    return (
        <div>
        <h3>Compte courant: {currentAccount}</h3>
        <hr />
        <h2>Voitures disponibles pour les enchères</h2>
        {voituresEncheres.map((enchere, index) => (
            <div key={index}>
                <h3>Voiture ID: {enchere.idVoiture}</h3>
                <h3>Meilleure offre: {enchere.meilleureOffre}</h3>
                <h3>Meilleur acheteur: {enchere.meilleurAcheteur}</h3>
                <button onClick={() => faireOffre(enchere.idVoiture)}>Faire une offre</button>
            </div>
        ))}
    </div>
);
};

export default AuctionComponent;
