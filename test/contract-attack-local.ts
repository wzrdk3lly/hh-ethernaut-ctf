import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { Attack, Elevator, Privacy } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Bytes, getContractAddress } from "ethers/lib/utils";
import exp from "constants";
import { boolean } from "hardhat/internal/core/params/argumentTypes";

describe("Elevator Exploit using Contract ", function () {
  let attackerContract: Attack,
    privacyContract: Privacy,
    attacker: SignerWithAddress,
    contractAddress: string,
    getTop: boolean;

  before("Setup for attack locally", async function () {
    // Learn how to convert to type of bytes in hardhat.
    // let bytes0 = ethers.utils.formatBytes32String("data at 0th slot");
    // let bytes1 = ethers.utils.formatBytes32String("data at 1st slot");
    // let bytes2 = ethers.utils.formatBytes32String("data at 2nd slot");
    // let arrayOfBytes32: Array<string> = [bytes0, bytes1, bytes2];
    // const privacyFactory = await ethers.getContractFactory("Privacy");
    // privacyContract = await privacyFactory.deploy(arrayOfBytes32);
  });

  it("perform exploit", async function () {
    // // Attack flow
    // 1 use ethers js to get storage slot at 5 and save as key variable
    // 2. Cast bytes32 key data to bytes16
    // 3. Call unlock passing in the bytes16 key
  });

  after("confirm exploit", async function () {
    // check that the reentrance contract == 0

    expect(getTop).to.be.eq(true);
  });
});
