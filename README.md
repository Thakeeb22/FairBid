# FairBid

A decentralized auction platform built with **React frontend**, **Node.js backend**, and **Starknet smart contracts**. Users can commit sealed bids, reveal them, and track the highest bids securely on-chain.

---

## 📁 Folder Structure

## FairBid/ ├─ frontend/ # React frontend ├─ backend/ # Node.js / Express API ├─ starknet/ # Starknet Cairo smart contracts ├─ .gitignore ├─ README.md └─ LICENSE

## ⚡ Features

- Commit Phase: Users submit hashed bids
- Reveal Phase: Users reveal bids using their secret phrase
- Live highest bid tracking
- Starknet integration for on-chain auction logic
- Countdown timers for commit/reveal phases

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Thakeeb22/FairBid.git
cd FairBid
2. Backend Setup
 cd backend
npm install
cp .env.example .env  # configure your environment variables
npm run dev            # start backend server
3. Frontend Setup
cd frontend
npm install
npm start
4. Starknet Contracts
cd starknet
# Setup Python virtual environment
python3 -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# Compile & deploy contracts
# Example using Cairo scripts
python scripts/deploy.py
Configuration
VITE_API_URL=http://localhost:5000/api
Usage
Navigate to frontend.
Connect Argent X wallet (Starknet).
Participate in auctions:
Commit your bid with a secret phrase.
Reveal bid after commit deadline.
Track live highest bid in real-time.
📌 Notes
Ensure Argent X wallet is installed for interacting with Starknet.
Node.js v18+ recommended.
🛡 License
This project is licensed under MIT License.
```
