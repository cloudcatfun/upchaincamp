// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Bank{
    
    address owner;
    mapping(address =>uint) public balances;

    constructor(){        
        owner = msg.sender;
    }
    
    //存款
    receive() external payable{
        balances[msg.sender] += msg.value;
    }

    //取
    function withdraw(uint256 _value) public{
        require(balances[msg.sender] >= _value,"insufficient balance");
        balances[msg.sender] -= _value;
        payable(msg.sender).transfer(_value);
    }

    function  withdrawAll() public  {//onlyOwner
        require(msg.sender == owner," only owner can do this ");
        uint all = address(this).balance;
        payable(owner).transfer(all);
    }

    
    
}