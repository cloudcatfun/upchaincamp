// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

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