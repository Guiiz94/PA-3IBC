import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Tab, Tabs } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Box from "@material-ui/core/Box";
import "./Dapp.css";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
import { BigNumber } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import NFTArtifact from "../contracts/NFTCar.json";
import NFTAddress from "../contracts/nft-address.json";
import TokenArtifact from "../contracts/FCarToken.json";
import TokenAddress from "../contracts/token-address.json";
import RaceArtifact from "../contracts/Race.json";
import RaceAddress from "../contracts/race-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
// import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";
// import Deck from "../Deck";
import axios from "axios";
import Card from "../components/Card";
import Deck from "../components/Deck";
import SignUp from "../SignUp";

// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = "31337";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

var isRegister = true;
var addrAdmin = 0x9f2b97c65a107E35Ae2204064C181BA7d6EA7610;
var addrWallet = "";

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
class Dapp extends React.Component {
  constructor(props) {
    super(props);

    if (props.dapp != null) {
      this.initialState = [...props.dapp];
    } else {
      // We store multiple things in Dapp's state.
      // You don't need to follow this pattern, but it's an useful example.
      this.initialState = {
        // The info of the token (i.e. It's Name and symbol)
        nftData: undefined,
        tokenData: undefined,
        // The user's address and balance
        selectedAddress: undefined,
        balance: undefined,
        // The ID about transactions being sent, and any possible error with them
        txBeingSent: undefined,
        transactionError: undefined,
        networkError: undefined,
        nfts: [],
        nftsId: [],
        auctionNfts: [],
        auctionNftsId: [],
        auctionPrices: [],
        auctionTimeouts: [],
        carsRows: [],
        winnerPrize: 0,
        tabValue: 0,
        profileData: null,
        betRace: [],
        entryRace: [],
      };
    }

    this.state = this.initialState;
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install a wallet.
    if (window.ethereum === undefined) {
      return <>No Wallet</>;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }

    const { profileData } = this.state;
    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        {!isRegister && <SignUp userAddress={this.state.selectedAddress} />}
        <div className="banderole">
          {profileData ? (
            profileData.success && profileData.user ? (
              <>
                <p>{profileData.user.PseudoUser}</p>
                <p>XP: {profileData.user.XPUser}</p>
                <p>Level: {profileData.user.LVLUser}</p>
                <button
                  style={{
                    background: "red",
                    fontSize: "85%",
                    height: "70%",
                    width: "15%",
                    marginLeft: "%",
                    opacity: "80%",
                  }}
                  onClick={() =>
                    this._deleteUser(this.state.profileData.user.WalletUser)
                  }
                >
                  Delete my account
                </button>
              </>
            ) : (
              <p>No user profile data</p>
            )
          ) : (
            <p>Loading profile data...</p>
          )}
        </div>
        <div
          className="row"
          style={{ display: "flex", justifyContent: "center", height: "70vh" }}
        >
          <div className="col-12">
            {/* <h1>
              {this.state.tokenData.tokenName} (
              {this.state.tokenData.tokenSymbol})
            </h1> */}
            <p>
              Welcome <b>{this.state.selectedAddress}</b>, you have
              {this.state.balance.eq(0) ? " no" : ""}{" "}
              {this.state.balance.toString()} {this.state.tokenData.tokenSymbol}
              .
              {this.props.page == "marketplace" && (
                <>
                  <Tabs
                    value={this.state.tabValue}
                    onChange={this.handleTabChange}
                    aria-label="simple tabs example"
                  >
                    <Tab label="Buy NFT" style={{ marginRight: "130px" }} />
                    <Tab label="Buy Token" />
                  </Tabs>
                  <TabPanel value={this.state.tabValue} index={0}>
                    <NewCar
                      generateNFT={(rarity) => this._generateNFT(rarity)}
                      type={0}
                    />
                    {/* <NewCar
                        generateNFT={(rarity) => this._generateNFT(rarity)}
                        type={1}
                      />
                      <NewCar
                        generateNFT={(rarity) => this._generateNFT(rarity)}
                        type={2}
                      />
                      <NewCar
                        generateNFT={(rarity) => this._generateNFT(rarity)}
                        type={3}
                      /> */}
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={1}>
                    <BuyToken buyToken={(amount) => this._buyToken(amount)} />
                  </TabPanel>
                </>
              )}
            </p>

            {this.props.page == "garage" ? (
              this.state.nftsId.length > 0 && this.state.nfts.length > 0 ? (
                <Deck
                  onSale={false}
                  submitFonction={(nftId, price) => this._sellNft(nftId, price)}
                  nftsId={this.state.nftsId}
                  collection={this.state.nfts}
                  enterRace={(nftId, speed, acceleration, maniability) =>
                    this._enterRace(nftId, speed, acceleration, maniability)
                  }
                />
              ) : (
                <p>Your deck is empty.</p>
              )
            ) : (
              <></>
            )}

            {this.props.page == "enchere" ? (
              this.state.auctionNftsId.length > 0 &&
              this.state.auctionNfts.length > 0 ? (
                <Deck
                  onSale={true}
                  prices={this.state.auctionPrices}
                  timeouts={this.state.auctionTimeouts}
                  submitFonction={(nftId, price) => this._betNft(nftId, price)}
                  nftsId={this.state.auctionNftsId}
                  collection={this.state.auctionNfts}
                />
              ) : (
                <p>There is no auction at the moment.</p>
              )
            ) : (
              <></>
            )}

            {this.props.page == "race" &&
              this.state.selectedAddress == addrAdmin && (
                <>
                  <Button
                    style={{ backgroundColor: "white", color: "black" }}
                    onClick={() => this._runRace(this.state.price)}
                  >
                   Start the race
                  </Button>

                  {this.state.entryRace && this.state.entryRace.length > 0 ? (
                    <div className="row">
                      <div className="col-6">
                        <h3>Participants</h3>
                        <table style={{ borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid black" }}>
                                ID du jeton
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Propriétaire
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Vitesse
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Accélération
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Maniabilité
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.entryRace.map((entry, index) => (
                              <tr key={index}>
                                <td style={{ border: "1px solid black" }}>
                                  {Number(entry.tokenId)}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.owner}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.speed}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.acceleration}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.maniability}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount of the bet"
                                    onChange={(e) =>
                                      this.setState({
                                        betAmount: e.target.value,
                                      })
                                    }
                                  />
                                  <Button
                                    onClick={() =>
                                      this._placeBet(
                                        entry.tokenId,
                                        this.state.betAmount
                                      )
                                    }
                                  >
                                    Bet on this participant
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {this.state.betRace && this.state.betRace.length > 0 ? (
                        <div className="col-6">
                          <h3>Bet going</h3>
                          <table style={{ borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                <th style={{ border: "1px solid black" }}>
                                  Bettor
                                </th>
                                <th style={{ border: "1px solid black" }}>
                                  Amount
                                </th>
                                <th style={{ border: "1px solid black" }}>
                                  car ID
                                </th>
                                <th style={{ border: "1px solid black" }}>
                                  Total bets
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.betRace.map((bet, index) => (
                                <tr key={index}>
                                  <td style={{ border: "1px solid black" }}>
                                    {bet.bettor}
                                  </td>
                                  <td style={{ border: "1px solid black" }}>
                                    {bet.amount.toString()}
                                  </td>
                                  <td style={{ border: "1px solid black" }}>
                                    {bet.carId.toString()}
                                  </td>
                                  <td style={{ border: "1px solid black" }}>
                                    {this.state.betRace
                                      .filter(
                                        (b) =>
                                          b.carId.toString() ===
                                          bet.carId.toString()
                                      )
                                      .reduce(
                                        (total, b) =>
                                          total.add(
                                            BigNumber.from(b.amount.toString())
                                          ),
                                        BigNumber.from(0)
                                      )
                                      .toString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                       ) : (
                        <div className="col-6">
                          <h3>Bet going</h3>
                          <p>There are no bets at the moment.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>There are currently no attendees.</p>
                  )}
                </>
              )}
              
            {this.props.page == "race" &&
              this.state.selectedAddress != addrAdmin && (
                <>
                  {this.state.entryRace && this.state.entryRace.length > 0 ? (
                    <div className="row">
                      <div className="col-6">
                        <h3>Participants</h3>
                        <table style={{ borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid black" }}>
                                ID du jeton
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Propriétaire
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Vitesse
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Accélération
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Maniabilité
                              </th>
                              <th style={{ border: "1px solid black" }}>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.entryRace.map((entry, index) => (
                              <tr key={index}>
                                <td style={{ border: "1px solid black" }}>
                                  {Number(entry.tokenId)}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.owner}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.speed}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.acceleration}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {entry.maniability}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount of the bet"
                                    onChange={(e) =>
                                      this.setState({
                                        betAmount: e.target.value,
                                      })
                                    }
                                  />
                                  <Button
                                    onClick={() =>
                                      this._placeBet(
                                        entry.tokenId,
                                        this.state.betAmount
                                      )
                                    }
                                  >
                                    Bet on this participant
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {this.state.betRace && this.state.betRace.length > 0 ? (
                        <div className="col-6">
                          <h3>Bet going</h3>
                          <table style={{ borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                <th style={{ border: "1px solid black" }}>
                                  Bettor
                                </th>
                                <th style={{ border: "1px solid black" }}>
                                  Amount
                                </th>
                                <th style={{ border: "1px solid black" }}>
                                  car ID
                                </th>
                                <th style={{ border: "1px solid black" }}>
                                  Total bets
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.betRace.map((bet, index) => (
                                <tr key={index}>
                                  <td style={{ border: "1px solid black" }}>
                                    {bet.bettor}
                                  </td>
                                  <td style={{ border: "1px solid black" }}>
                                    {bet.amount.toString()}
                                  </td>
                                  <td style={{ border: "1px solid black" }}>
                                    {bet.carId.toString()}
                                  </td>
                                  <td style={{ border: "1px solid black" }}>
                                    {this.state.betRace
                                      .filter(
                                        (b) =>
                                          b.carId.toString() ===
                                          bet.carId.toString()
                                      )
                                      .reduce(
                                        (total, b) =>
                                          total.add(
                                            BigNumber.from(b.amount.toString())
                                          ),
                                        BigNumber.from(0)
                                      )
                                      .toString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                       ) : (
                        <div className="col-6">
                          <h3>Bet going</h3>
                          <p>There are no bets at the moment.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>There are currently no attendees.</p>
                  )}
                </>
              )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {/* 
                Sending a transaction isn't an immediate action. You have to wait
                for it to be mined.
                If we are waiting for one, we show a message here.
              */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
                Sending a transaction can fail in multiple ways. 
                If that happened, we show a message here.
              */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {/*
                If the user has no tokens, we don't show the Transfer form
              */}
            {this.state.balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )}

            {/*
                This component displays a form that the user can use to send a 
                transaction and transfer some tokens.
                The component doesn't have logic, it just calls the transferTokens
                callback.
              */}
            {/* {this.state.balance.gt(0) && (
                // <Transfer
                //   transferTokens={(to, amount) =>
                //     this._transferTokens(to, amount)
                //   }
                //   tokenSymbol={this.state.tokenData.symbol}
                // />
                <Bet
                  betTokens={(amount) =>
                    this._betTokens(amount)
                  }
                  tokenSymbol={this.state.tokenData.symbol}
                />
              )} */}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _dataProfile(wallet) {
    const url = "http://51.68.124.217:3030/api/users/check/" + wallet;
    // console.log(wallet);
    // console.log(url);

    try {
      const response = await axios.get(url);
      // console.log(response.data);
      this.setState({ profileData: response.data });
    } catch (error) {
      console.error("Erreur lors de la récupération du pseudo:", error);
    }
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.
    if (selectedAddress) {
      this._checkNetwork();
      this._initialize(selectedAddress);
      this._checkUserPseudo(selectedAddress)
        .then((response) => {
          if (response.success) {
            isRegister = true;
          }
        })
        .catch((error) => {
          isRegister = false;
          console.log(error);
        });
    }

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });
  }

  async _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      isRegister: false,
      selectedAddress: userAddress,
    });

    this._dataProfile(userAddress);

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._getTokenData();
    this._startPollingData();
    this._updateNFTs();
    this._updateAuctionNFTs();
    this._getRaceEntries();
    this._getBetsRace();
  }

  async _initializeEthers() {
    // console.log('HERE');
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._nft = new ethers.Contract(
      NFTAddress.Token,
      NFTArtifact.abi,
      this._provider.getSigner(0)
    );
    this._token = new ethers.Contract(
      TokenAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
    // console.log(RaceAddress);
    // console.log(RaceArtifact);
    this._race = new ethers.Contract(
      RaceAddress.Race,
      RaceArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => {
      this._updateBalance();
    }, 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
    this._updateNFTs();
    this._updateAuctionNFTs();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    const nftName = await this._nft.name();
    const nftSymbol = await this._nft.symbol();
    const tokenName = await this._token.name();
    const tokenSymbol = await this._token.symbol();

    this.setState({ nftData: { nftName, nftSymbol } });
    this.setState({ tokenData: { tokenName, tokenSymbol } });
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    this.setState({ balance });
  }

  async _updateNFTs() {
    const nftsId = await this._getUserNFTs();
    this.setState({ nftsId });

    const nftArr = [];

    nftsId.forEach(async (nft) => {
      nftArr.push(await this._getNft(nft));
    });
    this.setState({ nfts: nftArr });
    // console.log(this.state.nfts);
    // this._updateRows()
  }

  async _updateAuctionNFTs() {
    const auctionNftsId = await this._getAuctionNFTs();
    // console.log(auctionNftsId);
    this.setState({ auctionNftsId });

    const nftArr = [];
    const prices = [];
    const timeouts = [];

    auctionNftsId.forEach(async (auction) => {
      // console.log(auction);
      nftArr.push(await this._getNft(auction.carId));
      prices.push(auction.meilleureOffre);
      timeouts.push(auction.finEnchere);
    });
    // console.log(prices);
    this.setState({ auctionNfts: nftArr });
    this.setState({ auctionPrices: prices });
    this.setState({ auctionTimeouts: timeouts });
    // console.log(this.state.nfts);
    // this._updateRows()
  }

  async _getNft(id) {
    const nft = await this._nft.tokenURI(id);
    const nftValues = await axios.get(
      "https://nftstorage.link/ipfs/" + nft.split("//")[1]
    );
    return nftValues.data;
    // console.log(nftValues.data);
  }

  async _checkUserPseudo(UserWallet) {
    const url = "http://51.68.124.217:3030/api/users/check/" + UserWallet;
    const response = await axios.get(url);
    return response.data;
  }

  _deleteUser = async (UserWallet) => {
    const url = "http://51.68.124.217:3030/api/users/delete/" + UserWallet;
    try {
      const response = await axios.delete(url);
      window.location.href = "/home";
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  async _buyToken(amount) {
    const newValue = await this._token.buy(this.state.selectedAddress, {
      value: amount,
    });
    this._updateBalance();
  }

  async _sellToken(amount) {
    const newValue = await this._token.sell(this.state.selectedAddress, {
      value: amount,
    });
    this._updateBalance();
  }

  async _sellNft(nftId, price) {
    const newValue = await this._nft.commencerEnchere(
      nftId,
      price,
      this.state.selectedAddress
    );
    this._updateNFTs();
    this._updateAuctionNFTs();
  }

  async _betNft(nftId, price) {
    const auth = await this._token.approve(this._nft.address, price, {
      gasLimit: 100000,
    });
    const authReceipt = await auth.wait();
    const newValue = await this._nft.faireOffre(nftId.carId, price);
  }

  async _getActiveAuction() {
    const activeAuction = await this._nft.getActiveAuctions();
    return activeAuction;
  }

  async _updateRows() {
    // Copiez le tableau de voitures de l'état
    const sortedCars = [...this.state.cars];
    // console.log(sortedCars);

    // Triez les voitures par rareté (premier élément de chaque voiture)
    sortedCars.sort((car1, car2) => {
      const rarityOrder = {
        Relic: 6,
        Legendary: 5,
        Mythic: 4,
        Rare: 3,
        Uncommon: 2,
        Common: 1,
      };

      const rarity1 = car1[1];
      const rarity2 = car2[1];

      // Comparez les valeurs de rareté en utilisant l'ordre de hiérarchie défini
      if (rarityOrder[rarity1] > rarityOrder[rarity2]) {
        // console.log(`car1: ${car1[1]} > car2: ${car2[1]}`);
        return -1;
      } else if (rarityOrder[rarity1] < rarityOrder[rarity2]) {
        // console.log(`car1: ${car1[1]} < car2: ${car2[1]}`);
        return 1;
      } else {
        // console.log(`car1: ${car1[1]} == car2: ${car2[1]}`);
        return 0;
      }
    });

    let carsRows = [];
    let carsRow = [];
    for (let i = 1; i <= sortedCars.length; i++) {
      carsRow.push(sortedCars[i - 1]);
      if (i % 7 == 0) {
        carsRows.push(carsRow);
        carsRow = [];
      }
      if (i == sortedCars.length && carsRow.length > 0) carsRows.push(carsRow);
    }
    this.setState({ carsRows });
    // console.log(this.state.carsRows);
  }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _transferTokens(to, amount) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._token.transfer(to, amount);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  async _switchChain() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  // This method checks if the selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      this._switchChain();
    }
  }

  async _generateNFT(rarity) {
    try {
      const auth = await this._token.approve(this._nft.address, 10, {
        gasLimit: 100000,
      });
      const authReceipt = await auth.wait();
      // send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._nft.mint(rarity, { gasLimit: 1000000 });
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      this._updateNFTs();

      // update the user's balance.
      await this._updateBalance();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // clear the txBeingSent part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  async _getUserNFTs() {
    try {
      // send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._nft.getUserNFTs();
      this.setState({ txBeingSent: tx.hash });
      // console.log(tx);
      let nfts = [];
      tx.forEach(async (nft) => {
        // const car = await this._nft.getCar(elm);
        nfts.push(nft);
      });

      return nfts;
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // clear the txBeingSent part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  async _getAuctionNFTs() {
    try {
      // send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._nft.getActiveAuctions();
      this.setState({ txBeingSent: tx.hash });
      // console.log(tx);
      let nfts = [];
      tx.forEach(async (nft) => {
        // const car = await this._nft.getCar(elm);
        nfts.push(nft);
      });

      return nfts;
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // clear the txBeingSent part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  async _enterRace(tokenId, speed, acceleration, maniability) {
    try {
      const auth = await this._token.approve(this._race.address, 10, {
        gasLimit: 100000,
      });
      const authReceipt = await auth.wait();
      const tx = await this._race.enterRace(
        tokenId,
        speed,
        acceleration,
        maniability
      );
      this._levelUpParticipants(this.state.selectedAddress);
      this._getParticipantsRace(this.state.selectedAddress);
      await tx.wait();
    } catch (error) {
      console.error("An error occurred while entering the race: ", error);
    }
  }

  async _placeBet(tokenId, amount) {
    try {
      const auth = await this._token.approve(this._race.address, 10, {
        gasLimit: 100000,
      });
      const authReceipt = await auth.wait();
      const bet = await this._race.placeBet(tokenId, amount);
      await bet.wait();
    } catch (error) {
      console.error("An error occurred while placing the bet: ", error);
    }
  }

  async _runRace() {
    try {
      // Passez le prix du gagnant à la fonction runRace de votre contrat
      const tokenId = await this._race.runRace();
      console.log("TokenId : ", tokenId);
      this._race.on("Win",(winner)=>{
        console.log("TEST");
        console.log(winner);
        this._getWinnerRace(winner);
        this._levelUpParticipants(winner);
      })

      return 0;
    } catch (error) {
      console.error("An error occurred while running the race: ", error);
    }
  }

  async _getRaceEntries() {
    try {
      const raceEntries = await this._race.getRaceEntries();

      console.log(raceEntries);
      this.setState({ entryRace: raceEntries });
      // Après avoir obtenu les entrées de la course, vous pouvez les envoyer à votre API
      // this._levelUpParticipants(raceEntries);
      // this._getParticipantsRace(raceEntries);
    } catch (error) {
      console.error("An error occurred while getting the race: ", error);
    }
  }

  async _levelUpParticipants(participant) {
    try {
        const response = await axios.post(`http://51.68.124.217:3030/api/users/levelUpUser/${participant}`);
        console.log(response.data);
    } catch (error) {
      console.error(
        "An error occurred while leveling up the participants: ",
        error
      );
    }
  }

  async _getWinnerRace(wallet) {
    try {
      const uri = `http://51.68.124.217:3030/api/users/incrementXPUser/winner/${wallet}`;
      const response = await axios.post(uri);
      console.log(response.data);
    } catch (error) {
      console.error("An error occurred while getting the winner: ", error);
    }
  }


  async _getParticipantsRace(walletAddress) {
    try {
        const response = await axios.post(`http://51.68.124.217:3030/api/users/incrementXPUser/participate/${walletAddress}`);

        console.log(response.data);
    } catch (error) {
      console.error(
        "An error occurred while sending the participants to the API: ",
        error
      );
    }
  }

  async _getBetsRace() {
    try {
      const raceBETs = await this._race.getBets();
      console.log(raceBETs);
      this.setState({ betRace: raceBETs });
    } catch (error) {
      console.error("Failed to get bets: ", error);
    }
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function NewCar({ generateNFT, type }) {
  const classes = useStyles();
  let rarity, icon;
  switch (type) {
    case 0:
      rarity = "CLASSIC";
      icon = "fas fa-star"; // Remplacez par l'icône de votre choix
      break;
    case 1:
      rarity = "DIAMOND";
      icon = "fas fa-gem"; // Remplacez par l'icône de votre choix
      break;
    case 2:
      rarity = "GOLD";
      icon = "fas fa-trophy"; // Remplacez par l'icône de votre choix
      break;
    case 3:
      rarity = "SILVER";
      icon = "fas fa-medal"; // Remplacez par l'icône de votre choix
      break;
  }
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          generateNFT(type);
        }}
      >
        <div className="button">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            endIcon={<i className={icon}></i>}
            type="submit"
          >
            {rarity}
          </Button>
        </div>
      </form>
    </>
  );
}

function GetNFTs({ getUserNFTs }) {
  return (
    <>
      <form
        onSubmit={async (event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          getUserNFTs();
        }}
      >
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="get" />
        </div>
      </form>
    </>
  );
}

const useStyles2 = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function BuyToken({ buyToken }) {
  const classes = useStyles2();
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.currentTarget.value);
  };
  return (
    <>
      <form
        className={classes.root}
        onSubmit={async (event) => {
          event.preventDefault();
          buyToken(amount);
        }}
      >
        <TextField
          id="outlined-basic"
          label="Amount"
          variant="outlined"
          type="number"
          onChange={handleChange}
          style={{ marginTop: "40px" }}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
          style={{ marginTop: "40px" }}
        >
          Acheter
        </Button>
      </form>
    </>
  );
}

function SellToken({ sellToken }) {
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.currentTarget.value);
  };
  return (
    <>
      <form
        onSubmit={async (event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          if (amount <= this.balance) sellToken(amount);
        }}
      >
        <div className="form-group">
          <input type="number" onChange={handleChange} />
          <input className="btn btn-primary" type="submit" value="Sell" />
        </div>
      </form>
    </>
  );
}

export default Dapp;
