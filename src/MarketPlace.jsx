import React from 'react';
import './MarketPlace.css';

const MarketPlace = () => {
  return (
    <div className="container marketplace mt-5">
      <h1 className="text-center mb-4">Marketplace NFT</h1>
      <div className="row">
        {
        <div className="col-md-4">
        <div className="card mb-4">
          <img src="lien_vers_image_nft" className="card-img-top" alt="Nom du NFT" />
          <div className="card-body">
            <h5 className="card-title">Nom du NFT</h5>
            <p className="card-text">Description du NFT</p>
            <p className="card-text">Prix : 0.5 ETH</p>
            <a href="#" className="btn btn-primary">Acheter</a>
          </div>
        </div>
      </div>
            
        }
      </div>
    </div>
  );
};

export default MarketPlace;