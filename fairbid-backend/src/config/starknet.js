console.log("====== ENV DEBUG ======");
console.log("All ENV keys:", Object.keys(process.env));
console.log("ADMIN_ADDRESS:", process.env.ADMIN_ADDRESS);
console.log("ADMIN_PRIVATE_KEY exists:", !!process.env.ADMIN_PRIVATE_KEY);
console.log("STARKNET_RPC:", process.env.STARKNET_RPC);
console.log("=======================");
const { Provider, Account } = require("starknet");

const provider = new Provider({
  nodeUrl: process.env.STARKNET_RPC,
});

const adminAddress = process.env.ADMIN_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

if (!adminAddress || !adminPrivateKey) {
  throw new Error("ADMIN_ADDRESS or ADMIN_PRIVATE_KEY missing");
}

const account = new Account(provider, adminAddress, adminPrivateKey);

module.exports = { account };