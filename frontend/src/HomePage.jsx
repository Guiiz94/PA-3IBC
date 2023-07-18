import React from 'react';
import demo_gif from './images/course.gif'
import './HomePage.css';

const HomePage = () => {
  return (
    <>
    <div className="container-mt-5-home-content">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to F-Race</h1>
        {/* <Dapp/> */}
        <p className="lead">
        The best site to exchange your cryptocurrencies quickly and securely.


        </p>
        <hr className="my-4" />
        <p>
        Join F-Race now, the NFT marketplace dedicated to racing cars and vehicles. Start trading your unique automotive NFTs and participate in thrilling races.
        </p>
        <img className='gif-demo' src={demo_gif}/>
      </div>
    </div>
    </>
  );
};

export default HomePage;