require("@nomicfoundation/hardhat-toolbox");

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const goerli = process.env.GOERILI
const owner = process.env.owner
const other = process.env.other
const scankey = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.18",
  networks: {
    goerliTest:{
      url:"https://eth-goerli.api.onfinality.io/public",      
      accounts:[
        goerli,
      ],
      chainId:5,
    },
    dev:{
      url:"http://127.0.0.1:8545",    
      chainId:31337,
    }
  },

  abiExporter: {
      path: './deployments/abi',
      clear: true,
      flat: true,
      only: [],
      spacing: 2,
      pretty: true,
  },

  etherscan: {
    apiKey: scankey
},


};
