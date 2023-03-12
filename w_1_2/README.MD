### w_1_2 作业

##### 1、仅有部署者可以调用count（）

```
contract Counter{
    uint256 counter;
    address owner;
    constructor(uint256 x){
        counter = x;
        owner = msg.sender;
    }
    function count() public {
        require(msg.sender == owner,"invalid call !");
        counter +=1; 
    }
}
```

##### 2、部署合约

![1](https://github.com/cloudcatfun/upchaincamp/blob/main/w_1_2/png/1.png)

##### 3、部署者成功调用，其他地址调用失败

![3](https://github.com/cloudcatfun/upchaincamp/blob/main/w_1_2/png/2.png)

##### 4、开源到区块浏览器

![3](https://github.com/cloudcatfun/upchaincamp/blob/main/w_1_2/png/3.png)

hardhat verify 一直timeout ，最后手动verify

https://goerli.etherscan.io/address/0x4e74aEf65Dcb17e8e530e6F4498e9AbE54Abe687#code

![4](https://github.com/cloudcatfun/upchaincamp/blob/main/w_1_2/png/4.png)
