// src/config/starknet.js
require('dotenv').config();

// 🔒 Validate env vars exist
const required = ['STARKNET_RPC', 'ADMIN_ADDRESS', 'ADMIN_PRIVATE_KEY', 'FAIRBID_CONTRACT_ADDRESS'];
for (const key of required) {
  const val = process.env[key];
  if (!val || typeof val !== 'string' || !val.trim()) {
    throw new Error(`🚨 FATAL: "${key}" is missing or invalid. Value: ${JSON.stringify(val)}`);
  }
}

// 🧹 Sanitize hex values: remove quotes, whitespace, force lowercase, ensure 0x prefix
const sanitizeHex = (val, label) => {
  let cleaned = String(val).trim().replace(/^["']|["']$/g, '');
  if (!cleaned.toLowerCase().startsWith('0x')) cleaned = '0x' + cleaned;
  cleaned = '0x' + cleaned.slice(2).replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (!/^0x[0-9a-f]{1,64}$/.test(cleaned)) {
    throw new Error(`${label} failed validation: "${cleaned}"`);
  }
  return cleaned;
};

// 🔍 Log what we're using (hide sensitive parts)
console.log('🔐 Starknet Config:');
console.log('   RPC:', process.env.STARKNET_RPC.trim());
console.log('   Address:', sanitizeHex(process.env.ADMIN_ADDRESS, 'ADMIN_ADDRESS'));
console.log('   PrivateKey: 0x' + sanitizeHex(process.env.ADMIN_PRIVATE_KEY, 'ADMIN_PRIVATE_KEY').slice(2, 10) + '...');

const { Account, Provider } = require('starknet');

// 🚀 Initialize with sanitized values
const provider = new Provider({ nodeUrl: process.env.STARKNET_RPC.trim() });
const address = sanitizeHex(process.env.ADMIN_ADDRESS, 'ADMIN_ADDRESS');
const privateKey = sanitizeHex(process.env.ADMIN_PRIVATE_KEY, 'ADMIN_PRIVATE_KEY');

console.log('🔄 Creating Account...');
const account = new Account(provider, address, privateKey);
console.log('✅ Account created:', account.address);

module.exports = { account, provider };