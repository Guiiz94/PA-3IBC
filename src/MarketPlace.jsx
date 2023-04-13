import React from 'react';
import './MarketPlace.css';

const MarketPlace = () => {
  return (
    <div className="container marketplace mt-5">
      <h1 className="text-center mb-4">Marketplace NFT</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-content">
              <div className="card-title">
                <h3>Nom du NFT</h3>
              </div>
              <div className="img">
                <img src="lien_vers_image_nft" alt="Nom du NFT" />
              </div>
              <div className="card-body">
                <p>Description du NFT</p>
                <p>Prix : 0.5 ETH</p>
               </div>   
               <div className="card-footer">
                <a href="#" className="btn btn-primary">Acheter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
