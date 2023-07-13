const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("endAuctions", "end auctions")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver}, { ethers }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/nft-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("NFTCar", address.Token);

    // const tx = await token.addCollection("ipfs://bafybeibgvtf2grdqbh2cq5o53ypq67pcm3f56mykel2r66hcgbnyd4caeq","5543432332343221543");
    const tx = await token.endAuctions();
    await tx.wait();

    console.log(`Auctions ended`);
  });
