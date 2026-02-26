const { Provider, Account } = require("starknet");

// Use the correct RPC URL for testnet
const provider = new Provider({
  nodeUrl: process.env.STARKNET_RPC || "https://rpc.starknet-testnet.lava.build/rpc/v0_9",
});

const adminAddress = process.env.ADMIN_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

if (!adminAddress) {
  throw new Error("❌ ADMIN_ADDRESS is missing in environment variables");
}

if (!adminPrivateKey) {
  throw new Error("❌ ADMIN_PRIVATE_KEY is missing in environment variables");
}

// Backend wallet
const account = new Account(provider, adminAddress, adminPrivateKey);

module.exports = { account };