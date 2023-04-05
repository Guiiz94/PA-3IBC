import React from 'react';
import Navbar from './Navbar.jsx';

const HomePage = () => {
  return (
    <>
     <div className="navbar-wrapper">
     <Navbar />
     </div>
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Bienvenue sur F-Race</h1>
        <p className="lead">
          Le meilleur site pour échanger vos crypto-monnaies rapidement et en toute sécurité.
        </p>
        <hr className="my-4" />
        <p>
          Inscrivez-vous dès maintenant et commencez à échanger vos crypto-monnaies.
        </p>
        <button className="btn btn-primary btn-lg">Inscrivez-vous</button>
      </div>
    </div>
    </>
  );
};

export default HomePage;
