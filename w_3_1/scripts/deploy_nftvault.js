// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


    const Vault = await hre.ethers.getContractFactory("NFTVault");
    const vault = await Vault.deploy("0xEA92b7F087a7e87be817C6D7e6C28B8EA5fFFfeB","0xD536c429586Ff1d74CD1100dc6D7ED59F32cb996");

    await vault.deployed();
    console.log("nft Vault deploy to " + vault.address);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
