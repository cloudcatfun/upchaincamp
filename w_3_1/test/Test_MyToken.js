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
    // describe("depositToken", function () {
    //     //在vault 中 存ccf token  
    //     it(" depositToken ", async function () {
    //         const { ccf, vault } = await loadFixture(deployFixture);
    //         await vault.depositToken(ccf.address, 20000);
    //         expect(await vault.tokens(ccf.address, vault.address)).to.be.equal(20000);
    //     });
    // });

    // describe("withdrawToken", function () {
    //     //取
    //     it(" withdrawToken ", async function () {
    //         const { ccf, vault } = await loadFixture(deployFixture);
    //         await vault.withdrawToken(ccf.address, 10000);
    //         expect(await vault.tokens(ccf.address, vault.address)).to.be.equal(10000);
    //     });
    // });


    // describe("Withdrawals", function () {
    //     describe("Validations", function () {
    //         it("Should revert with the right error if called too soon", async function () {
    //             const { lock } = await loadFixture(deployOneYearLockFixture);

    //             await expect(lock.withdraw()).to.be.revertedWith(
    //                 "You can't withdraw yet"
    //             );
    //         });

    //         it("Should revert with the right error if called from another account", async function () {
    //             const { lock, unlockTime, otherAccount } = await loadFixture(
    //                 deployOneYearLockFixture
    //             );

    //             // We can increase the time in Hardhat Network
    //             await time.increaseTo(unlockTime);

    //             // We use lock.connect() to send a transaction from another account
    //             await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //                 "You aren't the owner"
    //             );
    //         });

    //         it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //             const { lock, unlockTime } = await loadFixture(
    //                 deployOneYearLockFixture
    //             );

    //             // Transactions are sent using the first signer by default
    //             await time.increaseTo(unlockTime);

    //             await expect(lock.withdraw()).not.to.be.reverted;
    //         });
    //     });

    //     describe("Events", function () {
    //         it("Should emit an event on withdrawals", async function () {
    //             const { lock, unlockTime, lockedAmount } = await loadFixture(
    //                 deployOneYearLockFixture
    //             );

    //             await time.increaseTo(unlockTime);

    //             await expect(lock.withdraw())
    //                 .to.emit(lock, "Withdrawal")
    //                 .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //         });
    //     });

    //     describe("Transfers", function () {
    //         it("Should transfer the funds to the owner", async function () {
    //             const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //                 deployOneYearLockFixture
    //             );

    //             await time.increaseTo(unlockTime);

    //             await expect(lock.withdraw()).to.changeEtherBalances(
    //                 [owner, lock],
    //                 [lockedAmount, -lockedAmount]
    //             );
    //         });
    //     });
    // });
});
