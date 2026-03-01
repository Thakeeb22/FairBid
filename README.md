FairBid
Sealed-bid auctions on Starknet — where transparency meets privacy

https://img.shields.io/badge/TypeScript-87%25-3178C6?style=flat-square&logo=typescript
https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react
https://img.shields.io/badge/Cairo-Starknet-FF6B4A?style=flat-square&logo=starknet
https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=node.js
https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square

Overview
FairBid is a decentralized sealed-bid auction platform that solves the fundamental problem of traditional auctions: lack of privacy and fairness.
By leveraging Starknet’s scalability and cryptographic guarantees, users can commit bids privately and reveal them securely — while maintaining full transparency on-chain.
Why FairBid?
🚫 No bid sniping — bids are hidden until reveal phase
🔐 True privacy — bids are hashed with a secret phrase
⚡ Scalable — powered by Starknet for low gas fees
🔎 Fully auditable — auction logic lives on-chain
Architecture
Copy code

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend│────▶│   Node.js API   │────▶│    Starknet     │
│   (TypeScript)  │◀────│   (Express)     │◀────│ Smart Contracts │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
    Wallet Connect         Real-time Updates        On-chain State
Smart Contracts (Cairo)
Auction.cairo — Commit, reveal, finalize logic
BidHash.cairo — Sealed bid hashing
Timelock.cairo — Commit/reveal phase control
Backend (Node.js / Express)
REST API for auction metadata
WebSocket server for real-time updates
Optional database for off-chain history
Frontend (React + TypeScript)
Starknet wallet integration
Real-time countdown timers
Responsive auction dashboard
Features
Phase
What Happens
On-chain
Commit
Submit hash(bid + secret)
✅ Yes
Reveal
Reveal bid + secret
✅ Yes
Finalize
Highest valid bid wins
✅ Yes
Tracking
Live highest bid updates
⚡ Backend
Key Capabilities
Sealed bids — no one sees your bid early
Anti-cheat verification
Automatic phase transitions
Gas-efficient storage
Multi-auction support
Quick Start (Local Development)
Prerequisites
Node.js v18+
Python 3.9+ (for Cairo)
Starknet wallet (ArgentX / Braavos)
Git
1. Clone & Install
Bash
Copy code
git clone https://github.com/Thakeeb22/FairBid.git
cd FairBid

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Cairo
cd ../starknet
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
2. Environment Configuration
Backend .env
Env
Copy code
PORT=5000
STARKNET_NETWORK=sepolia
DATABASE_URL=optional
Frontend .env
Env
Copy code
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=your_contract_address
3. Run Locally
Terminal 1 — Backend
Bash
Copy code
cd backend
npm run dev
Terminal 2 — Frontend
Bash
Copy code
cd frontend
npm start
Terminal 3 — Deploy Contracts (Optional)
Bash
Copy code
cd starknet
python scripts/deploy.py
Usage Guide
For Participants
1. Connect Wallet
Open dashboard
Connect Starknet wallet
Ensure Sepolia testnet
2. Commit Phase
Enter bid amount
Create secret phrase (save it!)
Sign commit transaction
3. Reveal Phase
Submit original bid + secret
Contract verifies hash
4. Finalize
Highest valid bid wins
Future: Auction Creators
Deploy auctions with custom parameters
Configure durations and increments
Automated fee collection
Technical Deep Dive
Bid Commitment Example
JavaScript
Copy code
const calculateBidHash = (bid, secret) => {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'string'],
    [bid, secret]
  );
  return ethers.utils.keccak256(encoded);
};
Cairo Contract Skeleton
Cairo
Copy code
@storage
struct Storage {
    commitments: LegacyMap::<ContractAddress, felt252>,
    revealed_bids: LegacyMap::<ContractAddress, u256>,
    highest_bid: u256,
    commit_deadline: u64,
    reveal_deadline: u64,
}

#[external]
fn commit_bid(ref self: ContractState, hash: felt252) {
    let caller = get_caller_address();
    assert(self.commitments.read(caller) == 0, 'Already committed');
    assert(block_timestamp < self.commit_deadline, 'Commit phase ended');
    self.commitments.write(caller, hash);
}
API Endpoints
Method
Endpoint
Description
GET
/api/auctions
List auctions
GET
/api/auctions/:id
Auction details
GET
/api/auctions/:id/bids
Revealed bids
GET
/api/auctions/:id/status
Current phase
WS
/ws/auctions/:id
Live updates
Testing
Bash
Copy code
# Backend
cd backend && npm test

# Contracts
cd starknet && pytest

# Frontend
cd frontend && npm test
Deployment
Smart Contracts
Bash
Copy code
cd starknet
starknet deploy --network sepolia
Frontend (Vercel)
Bash
Copy code
cd frontend
npm run build
vercel --prod
Backend (Render / Railway)
Bash
Copy code
cd backend
npm start
Performance Optimizations
Off-chain indexing
WebSocket compression
Lazy-loaded history
Batched reveals
Security
Commit-reveal anti-front-running
Deadline enforcement
Input validation
Planned emergency pause
Roadmap
Commit-reveal core
Frontend dashboard
Backend API
Multi-auction support
Auction creation UI
Subgraph indexing
Cross-chain auctions
Contributing
Fork repo
Create branch
Commit changes
Push
Open PR
License
MIT License — see LICENSE file.
Acknowledgments
Starknet ecosystem
ArgentX wallet
OpenZeppelin patterns
Contact
GitHub Issues
Twitter: @FairBid
�

Built with ❤️ for the Starknet ecosystem
⭐ Star the repo • 🚀 Build the future of fair auctions