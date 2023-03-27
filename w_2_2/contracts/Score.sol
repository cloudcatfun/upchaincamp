// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IChangeScore {
    function changeScore(        
        address _student,
        uint256 _score
    ) external;
}

contract Score {
    address owner;
    address public teacher;
    mapping(address => uint256) public students;

    constructor() {
        owner = msg.sender;
    }

    function SetTeacher(address _teacher) public onlyOwner{
        teacher = _teacher;
    }

    function changeScore(address _student,uint256 _score) external  onlyTeacher{
        require(_score <= 100, " score should <=100 !");
        students[_student] = _score;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, " only teacher can do this");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"only owner can do this");
        _;
    }
}

contract Teacher {
    function setScore(address _scoreContract, address _student,uint256 _score) public payable {
        IChangeScore(_scoreContract).changeScore(_student, _score);
    }
}
