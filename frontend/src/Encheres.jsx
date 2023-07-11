import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AuctionComponent = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [tokenContract, setTokenContract] = useState(null);
    const [highestBid, setHighestBid] = useState(0);
    const [highestBidder, setHighestBidder] = useState('');
    const [bidValue, setBidValue] = useState('');

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

            const highestBid = await tokenContract.highestBid();
            const highestBidder = await tokenContract.highestBidder();
            setHighestBid(ethers.utils.formatEther(highestBid));
            setHighestBidder(highestBidder);
        } else {
            console.error("Ethereum is not connected");
        }
    };

    const placeBid = async () => {
        if (tokenContract && bidValue) {
            try {
                const tx = await tokenContract.bid({ value: ethers.utils.parseEther(bidValue) });
                await tx.wait();
                loadBlockchainData();
            } catch (error) {
                console.error("Error while bidding:", error);
            }
        }
    };

    const withdraw = async () => {
        if (tokenContract) {
            try {
                const tx = await tokenContract.withdraw();
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
        </div>
    );
};

export default AuctionComponent;    