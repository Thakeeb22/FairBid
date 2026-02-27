require('dotenv').config();
const { Account, ec, json, Provider } = require('starknet');

const provider = new Provider({ 
  nodeUrl: process.env.STARKNET_RPC 
});

const account = new Account(
  provider,
  process.env.ADMIN_ADDRESS,
  process.env.ADMIN_PRIVATE_KEY
);

console.log('ACCOUNT ADDRESS:', process.env.ADMIN_ADDRESS);
console.log('PRIVATE KEY exists:', !!process.env.ADMIN_PRIVATE_KEY);

module.exports = { account, provider };