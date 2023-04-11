// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Privacy {
    bool public locked = true; // 1 byte - Slot 0
    uint256 public ID = block.timestamp; // 32 bytes - slot 1
    uint8 private flattening = 10; // 1 bytes - slot 2
    uint8 private denomination = 255; // 1 bytes - slot 2
    uint16 private awkwardness = uint16(block.timestamp); // 2 bytes - slot 2
    bytes32[3] private data;

    // bytes[0] - slot 3
    // bytes[1] - slot 4
    // bytes[2] - slot 5
    constructor(bytes32[3] memory _data) {
        data = _data;
    }

    // To unlock we need to grab the data in the 5th slot and cast it to bytes16
    function unlock(bytes16 _key) public {
        require(_key == bytes16(data[2]));
        locked = false;
    }

    /*
    A bunch of super advanced solidity algorithms...

      ,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`
      .,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,
      *.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^         ,---/V\
      `*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.    ~|__(o.o)
      ^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'  UU  UU
  */
}
