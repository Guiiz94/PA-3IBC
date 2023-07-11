import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AuctionComponent = () => {
    const [currentAccount, setCurrentAccount] = useState('');
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
        } else {
            console.error("Ethereum is not connected");
        }

        const voituresEncheres = await tokenContract.obtenirVoituresEncheres();
        setVoituresEncheres(voituresEncheres);
    };

    const placeBid = async (idVoiture) => {
        if (tokenContract && bidValue) {
            try {
                const tx = await tokenContract.faireOffre(idVoiture, { value: ethers.utils.parseEther(bidValue) });
                await tx.wait();
                loadBlockchainData();
            } catch (error) {
                console.error("Error while bidding:", error);
            }
        }
    };

    const withdraw = async (idVoiture) => {
        if (tokenContract) {
            try {
                const tx = await tokenContract.remboursements(idVoiture);
                await tx.wait();
                loadBlockchainData();
            } catch (error) {
                console.error("Error while withdrawing:", error);
            }
        }
    };



    return (
        <div>
            <h3>Compte courant: {currentAccount}</h3>
            <h3>Plus haute offre: {highestBid} FRT par {highestBidder}</h3>
            <input type="number" value={bidValue} onChange={e => setBidValue(e.target.value)} placeholder="Montant de l'enchère" />
            <button onClick={placeBid}>Faire une offre</button>
            <button onClick={withdraw}>Retirer une offre</button>
            <hr />
            <h2>Voitures disponibles pour les enchères</h2>
        {voituresEncheres.map((idVoiture) => (
            <div key={idVoiture}>
                <h3>Voiture ID: {idVoiture}</h3>
                <button onClick={() => placeBid(idVoiture)}>Faire une offre</button>
                <button onClick={() => withdraw(idVoiture)}>Retirer une offre</button>
            </div>
        ))}

       
        </div>
    );
};

export default AuctionComponent;
