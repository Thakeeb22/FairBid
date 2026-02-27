// src/config/starknet.js - WORKING VERSION ✅
require('dotenv').config();

const { Account, Provider } = require('starknet');

// 🔒 Validate & sanitize env vars
const rpc = process.env.STARKNET_RPC?.trim();
const address = process.env.ADMIN_ADDRESS?.trim()?.toLowerCase();
const privateKey = process.env.ADMIN_PRIVATE_KEY?.trim()?.toLowerCase();

if (!rpc || !address?.startsWith('0x') || !privateKey?.startsWith('0x')) {
  throw new Error(`Invalid env vars: rpc=${!!rpc}, addr=${address?.slice(0,10)}, pk=${!!privateKey}`);
}

// ✅ Create Provider
const provider = new Provider({ nodeUrl: rpc });

// ✅ Create Account (with sanitized values)
const account = new Account(provider, address, privateKey);

console.log('✅ Starknet initialized:', account.address);
module.exports = { account, provider };