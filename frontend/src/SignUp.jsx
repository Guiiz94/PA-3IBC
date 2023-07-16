import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SignUp.css';

function SignUp(props) {
  const [pseudo, setPseudo] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = async (event) => {
    event.preventDefault();

    const url = 'http://localhost:3000/users/create';

    const requestBody = {
        WalletUser: props.userAddress,
        PseudoUser: pseudo,
        XPUser: 0,
        LevelUser: 1,
    };

    try {
        const response = await axios.post(url, requestBody);
        console.log(response.data);
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
