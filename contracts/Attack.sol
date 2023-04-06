// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./Reentrance.sol";

contract Attack {
    Reentrance public reentranceContract;

    constructor(address payable _reentranceContract) public {
        reentranceContract = Reentrance(_reentranceContract);
    }
}
