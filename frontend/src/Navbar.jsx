import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import logo from './images/F-Racelogo.png'
import './Navbar.css'

const Navbar = () => {

  const [account, setAccount] = useState('');
  const [pseudo, setPseudo] = useState('');

  const loadAccount = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      loadAccount();
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <div className='navbar-content'>
          <a className='logo-content' href="/home">
            <img className='navbar-logo' src={logo} width='80px'/>
            <h2>F-RACE</h2>
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="/home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/marketplace">MarketPlace</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/race">Race</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/garage">Garage</a>
              </li>
              {account && (
                <li className="nav-item">
                  <a className="nav-link" href="/profil">Mon Profil</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
