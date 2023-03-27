// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


    const CCFERC721 = await hre.ethers.getContractFactory("CCFERC721");
    const ccf = await CCFERC721.deploy();

    await ccf.deployed();
    console.log("ccf nft deploy to " + ccf.address);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
