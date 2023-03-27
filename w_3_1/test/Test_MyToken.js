const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Vault", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const CCFToken = await ethers.getContractFactory("CCFToken");
        const ccf = await CCFToken.deploy();
        const Vault = await ethers.getContractFactory("Vault");
        const vault = await Vault.deploy();
        return { ccf, vault,otherAccount };
    }

    describe("approve", function () {
        //授权 vault 20000
        it(" test approve depositToken withdrawToken", async function () {
            const { ccf, vault, otherAccount } = await loadFixture(deployFixture);
            //向 otherAccount 转账    
            await expect(() => ccf.transfer(otherAccount.address, 20000))
                .to.changeTokenBalance(ccf, otherAccount, 20000);
            //授权vault
            expect(await ccf.connect(otherAccount).approve(vault.address, 20000)).not.to.be.reverted;
            //往vault 存款
            expect(await vault.connect(otherAccount).depositToken(ccf.address, 20000)).to.changeTokenBalance(ccf, otherAccount, -20000);
            //向vault 取款
            //expect(await vault.connect(otherAccount).withdrawToken(ccf.address, 30000)).to.be.revertedWith("Insufficient deposits");
            expect(await vault.connect(otherAccount).withdrawToken(ccf.address, 10000)).to.changeTokenBalance(ccf, otherAccount, +10000);
        });
    });
  
});
