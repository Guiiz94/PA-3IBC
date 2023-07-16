// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("FCarToken");
  const token = await Token.deploy();
  await token.deployed();

  console.log("FCarToken address:", token.address);

  const NFT = await ethers.getContractFactory("NFTCar");
  const nft = await NFT.deploy(token.address);
  await nft.deployed();

  console.log("NFTCar address:", nft.address);
  


  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendTokenFiles(token);
  saveFrontendNFTFiles(nft);
}

function saveFrontendTokenFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "token-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("FCarToken");

  fs.writeFileSync(
    path.join(contractsDir, "FCarToken.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

function saveFrontendNFTFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "nft-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("NFTCar");

  fs.writeFileSync(
    path.join(contractsDir, "NFTCar.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
