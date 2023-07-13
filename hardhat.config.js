require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("./tasks/faucet");
require("./tasks/initCollection");
require("./tasks/endAuctions");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 800, // Increase or decrease the value to optimize size
    },
  },
};