import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importer useNavigate
import './SignUp.css';
import './web3/Dapp';

function SignUp(props) {
  const location = useLocation();
  const userAddress = location.state?.userAddress;
  const navigate = useNavigate(); // Utiliser useNavigate

  const [pseudo, setPseudo] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();

    const url = 'http://51.68.124.217:3030/api/users/create';

    const requestBody = {
      WalletUser: props.userAddress,
      PseudoUser: pseudo,
      XPUser: 0,
      LVLUser: 1
    };

    try {
      const response = await axios.post(url, requestBody);
      console.log(requestBody);
      console.log('Réponse du serveur:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  return (
    <div className="card-form">
      <form className="form" onSubmit={handleRegister}>
        <h3>Bienvenue, veuillez renseigner votre pseudo</h3>

        <div className="mt-8 flex flex-col items-center gap-4">
          <input type="text" className="wallet-address" placeholder="Wallet" value={props.userAddress} readOnly />
          <input type="text" placeholder="Pseudo" onChange={(e) => setPseudo(e.target.value)} />
          <button type="submit" className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
            S'enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;