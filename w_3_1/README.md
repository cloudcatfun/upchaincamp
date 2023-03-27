### w_3_1_1 作业

![2](https://github.com/cloudcatfun/upchaincamp/blob/main/w_3_1/pngs/w_3_1.png)

-   erc20 合约
地址：https://mumbai.polygonscan.com/address/0xEA92b7F087a7e87be817C6D7e6C28B8EA5fFFfeB#code
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


### NFT 发行
```
contract CCFERC721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721(unicode"CCF Test NFT", "CCFNFT") {}  
     //QmWymyj7mevJNwaU4hvvGGKivw8bGUuKBKsfAAArmxEwzn

    //ipfs://QmVFi5KHeDzGzWJ4fHATEcVaDbzPhPvEH68PuaowQTT9Lc
    function mint(address to, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }
}
```
地址
https://mumbai.polygonscan.com/address/0xD536c429586Ff1d74CD1100dc6D7ED59F32cb996#code

https://testnets.opensea.io/zh-CN/assets/mumbai/0xd536c429586ff1d74cd1100dc6d7ed59f32cb996/1

### NFT 交易合约 上架 购买
```

contract NFTVault is IERC721Receiver {
    mapping(uint => uint) public prices;
    address public immutable token;
    address public immutable nftToken;

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    constructor(address _token, address _nftToken) {
        token = _token;
        nftToken = _nftToken;
    }

    // approve(address to, uint256 tokenId) first
    function list(uint tokenID, uint amount) public {
        IERC721(nftToken).safeTransferFrom(
            msg.sender,
            address(this),
            tokenID,
            ""
        );
        prices[tokenID] += amount;
    }

    function buy(uint tokenId, uint amount) external {
        require(amount >= prices[tokenId], "low price");
        require(
            IERC721(nftToken).ownerOf(tokenId) == address(this),
            "aleady selled"
        );
        IERC20(token).transferFrom(msg.sender, address(this), prices[tokenId]);
        IERC721(nftToken).transferFrom(address(this), msg.sender, tokenId);
    }
}

```
verified 地址 
https://mumbai.polygonscan.com/address/0x65DDdB6A87D13be6A7F828f988DA7F6aF6920989#code

使用CCFTokenCCFToken 购买成功
https://mumbai.polygonscan.com/tx/0x9f6a12fcc027a0722d2717a8170a65a19594e7de4fa1fa15eb61ece5dd10ae69
![3](https://github.com/cloudcatfun/upchaincamp/blob/main/w_3_1/pngs/w_3_2.png)

