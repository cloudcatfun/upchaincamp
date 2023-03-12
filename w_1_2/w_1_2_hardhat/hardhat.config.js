require("@nomicfoundation/hardhat-toolbox");

let dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const goerli = process.env.GOERILI
const scankey = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
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
