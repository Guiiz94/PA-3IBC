import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import logo from './images/F-Racelogo.png'
import './Navbar.css'
import ConnectNavbar from './web3/ConnectNavbar';

const Navbar = () => {

  const [account, setAccount] = useState('');

  const loadAccount = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {  
    // loadAccount();
    window.ethereum.on('accountsChanged', () => {
    // loadAccount()
    });
  }, []);

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
              <a className="nav-link" href="/marketplace">
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
              <a className="nav-link" href="/connexion" onClick={loadAccount}>
                {/* Si pseudo vide,afficher adresse, si adresse vide, afficher le bouton de connexion */}
                {account ? account.substr(0, 8) + '...' + account.substr(account.length - 6) : 'Connexion'}
              </a>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};



export default Navbar;