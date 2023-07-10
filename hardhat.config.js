require("@nomicfoundation/hardhat-toolbox");
require("./tasks/faucet");
require("./tasks/initCollection");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};