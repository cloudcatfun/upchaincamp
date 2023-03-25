// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CCF {
    using SafeMath for uint256;
    string public name = "CouldCatFun";
    string public symbol = "CCF";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    //mapping
    mapping(address => uint256) public balanceOf;
    //授权
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_to != address(0));
        _tranfer(msg.sender, _to, _value);
        return true;
    }

    function _tranfer(address _from, address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    //授权
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        //msg.sender  current web login account
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //被授权的调用
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value); //余额大于转账额度
        require(allowance[_from][msg.sender] >= _value); //授权额度大于转账额度
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _tranfer(_from, _to, _value);
        return true;
    }
}
