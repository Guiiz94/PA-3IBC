import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './MarketPlace.css';

const MarketPlace = () => {
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
          {/* Contenu de l'onglet Catalogue */}
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
                    <p>Prix : 0.5 ETH</p>
                  </div>
                  <div className="card-footermp">
                    <a href="#" className="btnmp btn-primary">Acheter</a>
                  </div>
                </div>
              </div>
            </div>
            {/* Deuxième carte NFT */}
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
                    <a href="#" className="btnmp btn-primary">Acheter</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          {/* Contenu de l'onglet Enchères */}
          <p>Contenu de l'onglet Enchères.</p>
        </TabPanel>
        <TabPanel>
          {/* Contenu de l'onglet Mise en vente */}
          <p>Contenu de l'onglet Mise en vente.</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MarketPlace;
