### w_3_1_1 作业

![2](https://github.com/cloudcatfun/upchaincamp/blob/main/w_3_1/pngs/w_3_1.png)

-   erc20 合约
```
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CCFToken is ERC20 {
    constructor() ERC20("CCFToken", "CCF") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}

```
- Vault合约
```
//SPDX-License-Identifier:  MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./CCFToken.sol";

contract Vault {
    using SafeMath for uint256;
    mapping(address => mapping(address => uint256)) public tokens;

    constructor() {}

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    //存
    function depositToken(address _token, uint256 _amount) public {
        require(CCFToken(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //取
    function withdrawToken(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount, "Insufficient deposits");
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        CCFToken(_token).transfer(msg.sender, _amount);
    }
}

```
- 测试
```

describe("Vault", function () {
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

```
![1](https://github.com/cloudcatfun/upchaincamp/blob/main/w_3_1/pngs/test.png)

