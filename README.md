# Welcome to FRACE !!

--- 

This project use the new Web3 technologies to privide a funny website where you can buy and sell NFT cyberpunk cars !

---

## Installation

1. `npm install`
2. Update `.env` file
3. `cd frontend && npm install`

## Usage

### For localhost blockchain usage

1. Open a terminal and run `npx hardhat node`
2. Open a second terminal and run `npm run deploy`
3. Then run `npm run faucet`
4. Then run `npm run initCollection`
5. Open a third terminal and run `cd frontend && npm run dev`

### For testnet blockchain usage

1. Deploy your contract using a tool like [Remix](https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js)
2. Update your contract address in Dapp.jsx
3. Run `cd fontend && npm run dev`

---

To generate a new NFTs collection don't forget to use our [Card generator](https://github.com/MatthieuLvsr/cardGenerator) tool !