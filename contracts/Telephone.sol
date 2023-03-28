// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Telephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    } // @audit tx.origin = initial address of the EOA that starts the transaction chain
    // @audit msg.sender = immediate contract that sends the contracts
}
