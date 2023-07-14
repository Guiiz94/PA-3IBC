import React from 'react';
import './SignUp.css';

function SignUp() {

    return (
        <div className="card-form">
            <form className="form">
                <h3>Bienvenue, veuillez renseigner votre pseudo</h3>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <input type="text" className="wallet-address" placeholder="Wallet" value={"Address"} readOnly />
                    <input type="text" placeholder="Pseudo" />
                    <button class="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                        S'enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
