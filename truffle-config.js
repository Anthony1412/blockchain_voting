module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Ganache CLI default port
      network_id: "*",       // Match any network ID
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.21",      // Solidity compiler version
    },
  },

  // Truffle DB is disabled by default
  // db: {
  //   enabled: false
  // }
};
