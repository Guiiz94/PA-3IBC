import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenArtifact from "../contracts/FToken.json";
import contractAddress from "../contracts/contract-address.json";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HARDHAT_NETWORK_ID = '31337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const ConnectNavbar = () => {
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState();
  const [tokenData, setTokenData] = useState();
  const [balance, setBalance] = useState();
  const [networkError, setNetworkError] = useState();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(([selectedAddress]) => {
          _checkNetwork();
          _initialize(selectedAddress);
          window.ethereum.on("accountsChanged", ([newAddress]) => {
            if (newAddress === undefined) {
              return _resetState();
            }
            _initialize(newAddress);
            axios.get('http://localhost:3000/users/check/' + newAddress)
              .then(response => {
                console.log(response.data);
              })
              .catch(error => {
                console.log(error);
                if (error.response && error.response.status === 404) {
                  navigate('/connexion');
                }
              });
          });
        })
    }
    return _stopPollingData;
  }, []);

  const _initialize = (userAddress) => {
    setSelectedAddress(userAddress);
    _initializeEthers();
    _getTokenData();
    _startPollingData();
  }

  const _initializeEthers = () => {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  const _startPollingData = () => {
    this._pollDataInterval = setInterval(() => _updateBalance(), 1000);
    _updateBalance();
  }

  const _stopPollingData = () => {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  const _getTokenData = async () => {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    setTokenData({ name, symbol });
  }

  const _updateBalance = async () => {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    setBalance(balance);
  }

  const _dismissNetworkError = () => {
    setNetworkError(undefined);
  }

  const _resetState = () => {
    setSelectedAddress(undefined);
    setTokenData(undefined);
    setBalance(undefined);
    setNetworkError(undefined);
  }

  const _switchChain = async () => {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await _initialize(selectedAddress);
  }

  const _checkNetwork = () => {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      _switchChain();
    }
  }

  if (window.ethereum === undefined) {
    return <div className="navbar-item">No Wallet</div>;
  }

  if (!selectedAddress) {
    return (
      <div className="navbar-item">
        <ConnectWallet 
          connectWallet={() => _connectWallet()} 
          networkError={networkError}
          dismiss={() => _dismissNetworkError()}
        />
      </div>
    );
  }

  if (!tokenData || !balance) {
    return <div className="navbar-item"><Loading /></div>;
  }

  return (
    <div className="navbar-item">
      <p>
        {selectedAddress}
        <br />
        {balance.toString()} {tokenData.symbol}
      </p>
    </div>     
  );
}

export default ConnectNavbar;


// import React from "react";
// import { ethers } from "ethers";
// import TokenArtifact from "../contracts/FToken.json";
// import contractAddress from "../contracts/contract-address.json";
// import { ConnectWallet } from "./ConnectWallet";
// import { Loading } from "./Loading";
// import axios from 'axios';
// import { withRouter } from 'react-router-dom';


// const HARDHAT_NETWORK_ID = '31337';
// const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// class ConnectNavbar extends React.Component {
//   constructor(props) {
//     super(props);
//     this.initialState = {
//       tokenData: undefined,
//       selectedAddress: undefined,
//       balance: undefined,
//       txBeingSent: undefined,
//       transactionError: undefined,
//       networkError: undefined,
//       hasBet: false,
//     };
//     this.state = this.initialState;
//   }

//   render() {
//     if (window.ethereum === undefined) {
//       return <div className="navbar-item">No Wallet</div>;
//     }

//     if (!this.state.selectedAddress) {
//       return (
//         <div className="navbar-item">
//           <ConnectWallet 
//             connectWallet={() => this._connectWallet()} 
//             networkError={this.state.networkError}
//             dismiss={() => this._dismissNetworkError()}
//           />
//         </div>
//       );
//     }

//     if (!this.state.tokenData || !this.state.balance) {
//       return <div className="navbar-item"><Loading /></div>;
//     }

//     return (
//       <div className="navbar-item">
//         <p>
//           {this.state.selectedAddress}
//           <br />
//           {this.state.balance.toString()} {this.state.tokenData.symbol}
//         </p>
//       </div>     
//     );
//   }

//   componentWillUnmount() {
//     this._stopPollingData();
//   }

//   async _connectWallet() {
//     const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

//     this._checkNetwork();

//     this._initialize(selectedAddress);

//     window.ethereum.on("accountsChanged", ([newAddress]) => {
//       this._stopPollingData();
//       if (newAddress === undefined) {
//         return this._resetState();
//       }
      
//       this._initialize(userAddress); {
//         this.setState({
//           selectedAddress: userAddress,
//         });
//         axios.get('http://localhost:3000/users/check/' + userAddress)
//         .then(response => {
//           console.log(response.data);
//           // vous pouvez mettre à jour l'état avec les données reçues ici si nécessaire
//         })
//         .catch(error => {
//           console.log(error);
//           if (error.response && error.response.status === 404) {
//             // Si l'API retourne 404, redirige vers le composant SignUp
//             this.props.history.push('/connexion');
//           }
//         });
//       };
//     });
//   }

//   _initialize(userAddress) {
//     this.setState({
//       selectedAddress: userAddress,
//     });

//     this._initializeEthers();
//     this._getTokenData();
//     this._startPollingData();
//   }

//   async _initializeEthers() {
//     this._provider = new ethers.providers.Web3Provider(window.ethereum);

//     this._token = new ethers.Contract(
//       contractAddress.Token,
//       TokenArtifact.abi,
//       this._provider.getSigner(0)
//     );
//   }

//   _startPollingData() {
//     this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);
//     this._updateBalance();
//   }

//   _stopPollingData() {
//     clearInterval(this._pollDataInterval);
//     this._pollDataInterval = undefined;
//   }

//   async _getTokenData() {
//     const name = await this._token.name();
//     const symbol = await this._token.symbol();

//     this.setState({ tokenData: { name, symbol } });
//   }

//   async _updateBalance() {
//     const balance = await this._token.balanceOf(this.state.selectedAddress);
//     this.setState({ balance });
//   }

//   _dismissTransactionError() {
//     this.setState({ transactionError: undefined });
//   }

//   // This method just clears part of the state.
//   _dismissNetworkError() {
//     this.setState({ networkError: undefined });
//   }

//   // This is an utility method that turns an RPC error into a human readable
//   // message.
//   _getRpcErrorMessage(error) {
//     if (error.data) {
//       return error.data.message;
//     }

//     return error.message;
//   }

//   // This method resets the state
//   _resetState() {
//     this.setState(this.initialState);
//   }

//   async _switchChain() {
//     const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
//     await window.ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: chainIdHex }],
//     });
//     await this._initialize(this.state.selectedAddress);
//   }

//   // This method checks if the selected network is Localhost:8545
//   _checkNetwork() {
//     if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
//       this._switchChain();
//     }
//   }
  
// }

// export default withRouter(ConnectNavbar);

