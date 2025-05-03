require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/EZEd86CV-i3YXHRums4Q0sGDU7JR9peW",
      accounts: ["5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"]
    }
  },
};

