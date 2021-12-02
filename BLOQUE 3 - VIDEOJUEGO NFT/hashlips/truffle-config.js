
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", 
      port: 7545, 
      network_id: "*", 
    },
  },
  mocha: {
    // timeout: 100000
  },
  contracts_build_directory: "./src/contracts/",
  compilers: {
    solc: {
      version: "0.8.0", 
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  db: {
    enabled: false,
  },
};
