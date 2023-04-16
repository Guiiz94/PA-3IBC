import React from 'react';
import Navbar from './Navbar.jsx';
import demo_gif from './images/course.gif'
import './HomePage.css';

const HomePage = () => {
  return (
    <>
    <div className="container-mt-5-home-content">
      <div className="jumbotron">
        <h1 className="display-4">Bienvenue sur F-Race</h1>
        <p className="lead">
          Le meilleur site pour échanger vos crypto-monnaies rapidement et en toute sécurité.
        </p>
        <hr className="my-4" />
        <p>
          Inscrivez-vous dès maintenant et commencez à échanger vos crypto-monnaies.
        </p>
        <img className='gif-demo' src={demo_gif}/>
      </div>
    </div>
    </>
  );
};

export default HomePage;