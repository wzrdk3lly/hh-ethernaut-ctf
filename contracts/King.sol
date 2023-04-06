// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {
    address king; // winner / top contributor
    uint public prize;
    address public owner;

    constructor() payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner);
        payable(king).transfer(msg.value); //prevent this transfer from executing -> need a contract with no receive
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}
