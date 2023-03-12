const { expect } = require("chai");

describe("Counter", function () {
  let Counter;
  let counter;
  let owner;
  let otherAccount;
  beforeEach(async function () {
     [owner, otherAccount] = await ethers.getSigners();
     Counter = await ethers.getContractFactory("Counter");
     counter = await Counter.deploy(1);
  });

  it("Test Owner Call ", async function () {
    expect(await counter.count());

  });
  
  //https://learnblockchain.cn/docs/hardhat/guides/waffle-testing.html
  //要从默认账户以外的账户发送交易，你可以使用Ethers.js提供的connect()方法
  it("Test otherAccount Call", async function () {    
    expect(await counter.connect(otherAccount).count());
  });

});