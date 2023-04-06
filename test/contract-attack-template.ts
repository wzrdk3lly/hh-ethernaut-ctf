import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { Attack, Reentrance } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractAddress } from "ethers/lib/utils";

describe("Reentrancy Exploit using EOA", function () {
  let attackerContract: Attack,
    reentrantContract: Reentrance,
    attacker: SignerWithAddress,
    contractAddress: string;

  //   before("Setup for attack on sepolia [LIVE EXPLOIT", async function () {
  //     [attacker] = await ethers.getSigners();
  //     contractAddress = "0xDa181650f827530B578E0Da49861d3D0C86Bcfd9"; //instance address of contract to attack
  //     // Deploy my own attacker contract
  //     // const attackerContractFactory = await ethers.getContractFactory("Attack");
  //     // attackerContract = await attackerContractFactory.deploy(contractAddress);
  //     // await attackerContract.deployed();

  //     // insert contract address of ethernaut challenge
  //     reentrantContract = await ethers.getContractAt(
  //       "Reentrance",
  //       contractAddress
  //     );
  //   });
  before("Setup for attack locally", async function () {
    [attacker] = await ethers.getSigners();
    //instance address of contract to attack
    // Deploy my own attacker contract
    const reentrantContractFactory = await ethers.getContractFactory(
      "Reentrance"
    );
    reentrantContract = await reentrantContractFactory.deploy();
    await reentrantContract.deployed();
  });
  //  uncoment to test connection to deployed contract
  it("Test donation", async function () {
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
    let balanceInEthers = ethers.utils.formatEther(balanceOfContract);
    console.log("the balance of the reentrance contract is", balanceInEthers);
  });

  it("perform exploit", async function () {
    // // Attack flow
    //Test
    // let txAttack = await attackerContract.attack({
    //   value: ethers.utils.parseEther(".0001"),
    // });
    // // wait for attack to complete
    // let attackReciept = await txAttack.wait();
    // console.log("The receipt looks like this", attackReciept);
    // balance = await ethers.provider.getBalance(contractAddress);
  });

  after("confirm exploit", async function () {
    // // check if the balance is 0
    // expect(balance).to.be.eq("0");
  });
});
