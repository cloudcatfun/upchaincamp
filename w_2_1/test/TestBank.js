const { expect } = require("chai");
const { ethers } = require("hardhat/internal/lib/hardhat-lib");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Bank", function () {

    async function deployBankFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        const bank = await Bank.deploy();
        await bank.deployed();
        console.log("bank:" + bank.address);
        return { bank, owner, otherAccount };
    }

    it("translation", async function () {
        console.log("test  translation ");
        const { bank, owner, otherAccount } = await loadFixture(deployBankFixture);
        await expect(otherAccount.sendTransaction({
            to: bank.address,
            value: ethers.utils.parseEther("2")
        })).to.changeEtherBalances([otherAccount.address, bank.address], [ethers.utils.parseEther("-2"), ethers.utils.parseEther("2")])
    })


    it("withdrawSuccess", async function () {
        console.log("test  withdrawSuccess ");
        const { bank, owner, otherAccount } = await loadFixture(deployBankFixture);
        let withdraw = bank.connect(otherAccount).withdraw(ethers.utils.parseEther("1"));
        await expect(withdraw).eventually.to.rejectedWith(Error);
    })

    it("withdrawAll", async function () {
        console.log("test  withdrawAll ");
        const { bank, owner, otherAccount } = await loadFixture(deployBankFixture);     
        await expect(bank.connect(owner).withdrawAll());
    })



})