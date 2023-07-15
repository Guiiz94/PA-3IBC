import React from 'react';
import Dapp from "./web3/Dapp"

const Race = () => {
    return (
        <div>
            <h1>Page de course</h1>
            <p>Bienvenue sur la page de course. Ici, vous pourrez faire courir vos voitures NFT.</p>
            <Dapp page="race"></Dapp>
        </div>
    );
};

export default Race;
