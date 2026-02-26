console.log ('ACCOUNT ADDRESS:', process.env.ADMIN_ADDRESS)
const { Provider, Account } = require("starknet");

const RPC = process.env.STARKNET_RPC;
const ADDRESS = process.env.ADMIN_ADDRESS;
const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

//  RPC provider
const provider = new Provider({
  nodeUrl: RPC,
});

//  Create admin account
const adminAccount = new Account(provider, ADDRESS, PRIVATE_KEY);

module.exports = {
  provider,
  adminAccount,
};