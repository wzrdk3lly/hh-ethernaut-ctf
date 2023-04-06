// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint) public balances;

    // First I need to donate to my address to register my contract address
    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint balance) {
        return balances[_who];
    }

    // in my fallback function, we need to call back into withdraw (if contract balance > 0)
    //@audit theres no rentrant guard
    function withdraw(uint _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{value: _amount}(""); //@audit sender could be a contract that calls back into this function
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}
