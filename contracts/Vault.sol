// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    bool public locked;
    bytes32 private password; // @audit - private data is not technically private. You can see this data. There's no callable funciton for private data

    //I need to somehow access the private password data ->
    // IE. I cant call vaultContract.password() BUt I can call vaultContract.locked() -> Ture | False
    constructor(bytes32 _password) {
        locked = true;
        password = _password;
    }

    function unlock(bytes32 _password) public {
        if (password == _password) {
            locked = false;
        }
    }
}
