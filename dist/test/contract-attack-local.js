"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("Elevator Exploit using Contract ", function () {
    let attackerContract, gatekeeperOneContract, contractAddress, getTop;
    before("Setup for attack locally", async function () {
        // Deply gate keeper one contract
        const gatekeeperOneContractFactory = await hardhat_1.ethers.getContractFactory("GatekeeperOne");
        gatekeeperOneContract = await gatekeeperOneContractFactory.deploy();
        await gatekeeperOneContract.deployed();
        const attackerContractFactory = await hardhat_1.ethers.getContractFactory("Attack");
        attackerContract = await attackerContractFactory.deploy(gatekeeperOneContract.address);
        await attackerContract.deployed;
    });
    it("perform exploit", async function () {
        // Attack flow
        // 1. Send a tx from a contract and not directly from an EOA
        // 2. withing the contract, call enter with the address casted to bytes8 AND set the tx.gaslimit = 8191 wei
        let txAttack = await attackerContract.attack();
        let receiptAttack = await txAttack.wait();
        console.log("The receipt output is ", receiptAttack);
    });
    after("confirm exploit", async function () {
        // check that the reentrance contract == 0
        (0, chai_1.expect)(getTop).to.be.eq(true);
    });
});
