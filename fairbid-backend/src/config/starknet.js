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