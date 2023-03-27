//SPDX-License-Identifier:  MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

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
