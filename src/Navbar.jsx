import React from 'react';
import logo from './images/F-Racelogo.png'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* <a className="navbar-brand" href="/">F-Race.pnj (logo sexy)</a> */}
        {/* <hr className="my-4" /> */}
        <div className='navbar-content'>
          <div className='logo-content'>
            <img className='navbar-logo' src={logo} width='80px'/>
            <h2>F-RACE</h2>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/home">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/race">
                MarketPlace 
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/race">
                Race
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/garage">
                Garage
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/connexion">
                Connexion
              </a>
            </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
      </div>
    </nav>
  );
};

export default Navbar;
