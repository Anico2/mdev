require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@truffle/dashboard-hardhat-plugin");
require("solidity-docgen");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  networks: {
    hardhat: {
    },
    dashboard: {
      url: "http://localhost:24012/rpc",
    },
//    mumbai: {
//      chainId: 80001,
//      url: "https://polygon-mumbai-bor.publicnode.com"
    goerli: {
      chainId: 5,
      url: "https://ethereum-goerli.publicnode.com"
    },
  },

  docgen: {
    sourcesDir: "contracts",
    outputDir: "documentation",
    templates: "templates",
    pages: "files",
    clear: true,
    runOnCompile: true
  },

  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_KEY,
      goerli: process.env.ETHERSCAN_KEY}
  },
};
