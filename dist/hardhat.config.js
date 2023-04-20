"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat");
require("dotenv/config");
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const config = {
    solidity: "0.8.0",
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_RPC_URL}`,
            accounts: [PRIVATE_KEY],
            gasPrice: 20000000000,
            gas: 6000000,
        },
    },
};
exports.default = config;
