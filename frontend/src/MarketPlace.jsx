import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './MarketPlace.css';
import Dapp from "./web3/Dapp"

const MarketPlace = () => {
  const [web3, setWeb3] = useState(null);
  const [nftName, setNftName] = useState('');
  const [nftPrice, setNftPrice] = useState('');
  const [nftImage, setNftImage] = useState(null);
  const [nftSpeed, setNftSpeed] = useState(''); //Ajout de la variable nftSpeed
  const [nftAcceleration, setNftAcceleration] = useState(''); //Ajout de la variable nftAcceleration
  const [nftManeuverability, setNftManeuverability] = useState(''); //Ajout de la variable nftManeuverability

  const buyNFT = async (tokenId, price) => {
    if (!contract || !account) {
      alert("Veuillez vous connecter à votre portefeuille.");
      return;
    }

    try {
      const transaction = await contract.purchaseToken(tokenId, { value: price });
      await transaction.wait();
      alert("Félicitations ! Vous avez acheté le NFT avec succès.");
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de l'achat du NFT.");
    }
  };

  const loadAccount = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('NFT créé et mis en vente:', {
      nftName,
      nftSpeed, 
      nftAcceleration,
      nftManeuverability, 
      nftPrice,
      nftImage,
    });
    // ajouter le code pour interagir avec la blockchain et créer l'NFT
  };

  const nfts = [
    {
      id: 1,
      name: "NFT SUPER CAR",
      imageUrl: "",
      price: web3 ? web3.utils.toWei("0.2", "ether") : 0,
    }
  ];
  
  

  return (
    <div className="container marketplace mt-5">
      <h1 className="text-center mb-4">Marketplace NFT</h1>
      <Tabs>
        <TabList>
          <Tab>Catalogue</Tab>
          <Tab>Enchères</Tab>
        </TabList>

        <TabPanel>
          
          <Dapp page="marketplace"></Dapp>

        </TabPanel>
        <TabPanel>
          <Dapp page="enchere"></Dapp>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MarketPlace;
