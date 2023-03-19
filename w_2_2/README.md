### 编写合约 Score，用于记录学生(地址) 分数:
- 仅有老师 (用 modifier 权限控制) 可以添加和修改学生分数
- 分数不可以大于 100
- 编写合约 Teacher 作为老师，通过 IScore 接口调用修改学生分数

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//改分接口
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

```