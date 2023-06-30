import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './MarketPlace.css';
import Enchere from "./Encheres.jsx"


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
          <Tab>Mise en vente</Tab>
        </TabList>

        <TabPanel>
          Contenu du catalogue Spécial

          <div className="row">
            <div className="cardmp">
              <div className="card-contentmp">
                <div className="card-titlemp">
                  <div>
                    {nfts.map((nft) => (
                    <div key={nft.id}>
                    <h3>{nft.name}</h3>
                    <img src={nft.imageUrl} alt={nft.name} />
                    <p>Prix: {web3 ? web3.utils.fromWei(nft.price, "ether") : '...'} ETH</p>
                    <button onClick={() => buyNFT(nft.id, nft.price)}>
                      Acheter
                    </button>
                  </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

            {/* Première carte NFT */}
            <div className="col-md-4">
              <div className="cardmp">
                <div className="card-contentmp">
                  <div className="card-titlemp">
                    <h3>Nom du NFT</h3>
                  </div>
                  <div className="imgmp">
                    <img src="lien_vers_image_nft" alt="img" />
                  </div>
                  <div className="card-bodymp">
                    <p>Description du NFT</p>
                    <p>Prix : 0.5 ETH</p>
                  </div>
                  <div className="card-footermp">
                    <button onClick={() => buyNFT(nftId)} className="btnmp btn-primary">Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          Contenu du catalogue Platine  
          <div className="row">
            {/* Première carte NFT */}
            <div className="col-md-4">
              <div className="cardmp">
                <div className="card-contentmp">
                  <div className="card-titlemp">
                    <h3>Nom du NFT</h3>
                  </div>
                  <div className="imgmp">
                    <img src="lien_vers_image_nft" alt="img" />
                  </div>
                  <div className="card-bodymp">
                    <p>Description du NFT</p>
                    <p>Prix : 0.3 ETH</p>
                  </div>
                  <div className="card-footermp">
                  <button onClick={() => buyNFT(nftId)} className="btnmp btn-primary">Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          Contenu du catalogue Or 
          <div className="row">
            {/* Première carte NFT */}
            <div className="col-md-4">
              <div className="cardmp">
                <div className="card-contentmp">
                  <div className="card-titlemp">
                    <h3>Nom du NFT</h3>
                  </div>
                  <div className="imgmp">
                    <img src="lien_vers_image_nft" alt="img" />
                  </div>
                  <div className="card-bodymp">
                    <p>Description du NFT</p>
                    <p>Prix : 0.1 ETH</p>
                  </div>
                  <div className="card-footermp">
                    <button onClick={() => buyNFT(nftId)} className="btnmp btn-primary">Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          Contenu du catalogue Argent 
          <div className="row">
            {/* Première carte NFT */}
            <div className="col-md-4">
              <div className="cardmp">
                <div className="card-contentmp">
                  <div className="card-titlemp">
                    <h3>Nom du NFT</h3>
                  </div>
                  <div className="imgmp">
                    <img src="lien_vers_image_nft" alt="img" />
                  </div>
                  <div className="card-bodymp">
                    <p>Description du NFT</p>
                    <p>Prix : 0.05 ETH</p>
                  </div>
                  <div className="card-footermp">
                    <button onClick={() => buyNFT(nftId)} className="btnmp btn-primary">Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          Contenu du catalogue Bronze 
          <div className="row">
            {/* Première carte NFT */}
            <div className="col-md-4">
              <div className="cardmp">
                <div className="card-contentmp">
                  <div className="card-titlemp">
                    <h3>Nom du NFT</h3>
                  </div>
                  <div className="imgmp">
                    <img src="lien_vers_image_nft" alt="img" />
                  </div>
                  <div className="card-bodymp">
                    <p>Description du NFT</p>
                    <p>Prix : 0.2 ETH</p>
                  </div>
                  <div className="card-footermp">
                    <button onClick={() => buyNFT(nftId)} className="btnmp btn-primary">Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          Contenu du catalogue Classique 
          <div className="row">
            {/* Première carte NFT */}
            <div className="col-md-4">
              <div className="cardmp">
                <div className="card-contentmp">
                  <div className="card-titlemp">
                    <h3>Nom du NFT</h3>
                  </div>
                  <div className="imgmp">
                    <img src="lien_vers_image_nft" alt="img" />
                  </div>
                  <div className="card-bodymp">
                    <p>Description du NFT</p>
                    <p>Prix : 0.1 ETH</p>
                  </div>
                  <div className="card-footermp">
                    <button onClick={() => buyNFT(nftId)} className="btnmp btn-primary">Acheter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
        <p>Contenu de l'onglet Enchères.</p>
          {<Enchere></Enchere>}
        </TabPanel>
             <TabPanel>
              {/* Contenu de l'onglet Mise en vente */}
              <h2 className="text-center mb-4">Mettre en vente un NFT</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nftName" className="form-label">Nom du NFT</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nftName"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nftDescription" className="form-label">Statistiques du NFT</label>
                  <div className="d-flex flex-row justify-content-between">
                    <div className="flex-grow-1">
                      <label htmlFor="nftSpeed" className="form-label">Vitesse (sur 10)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="nftSpeed"
                        step="0.1"
                        min="0"
                        max="10"
                        value={nftSpeed}
                        onChange={(e) => setNftSpeed(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-grow-1">
                      <label htmlFor="nftAcceleration" className="form-label">Accélération (sur 10)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="nftAcceleration"
                        step="0.1"
                        min="0"
                        max="10"
                        value={nftAcceleration}
                        onChange={(e) => setNftAcceleration(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-grow-1">
                      <label htmlFor="nftManeuverability" className="form-label">Maniabilité (sur 10)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="nftManeuverability"
                        step="0.1"
                        min="0"
                        max="10"
                        value={nftManeuverability}
                        onChange={(e) => setNftManeuverability(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="nftPrice" className="form-label">Prix (en ETH)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="nftPrice"
                    step="0.01"
                    value={nftPrice}
                    onChange={(e) => setNftPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nftImage" className="form-label">Image du NFT</label>
                  <input
                    type="file"
                    className="form-control"
                    id="nftImage"
                    onChange={(e) => setNftImage(e.target.files[0])}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Mettre en vente</button>
              </form>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MarketPlace;
