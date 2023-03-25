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
