# 💸 Tip Jar - Stellar Soroban DApp

A simple decentralized Tip Jar application built on the Stellar network using Soroban smart contracts. Users can connect their wallet, send tips, and see the total tips collected update in real time.

## 🚀 Features

- Multi-wallet support via StellarWalletsKit (Freighter)
- Smart contract deployed on Stellar Testnet
- Live transaction status tracking (pending to success/fail)
- Real-time total tips display after each transaction
- Error handling for: wallet not found, transaction rejected, insufficient balance

## Tech Stack

- Smart Contract: Rust + Soroban SDK
- Frontend: React (Vite)
- Wallet Integration: @creit.tech/stellar-wallets-kit
- Blockchain SDK: @stellar/stellar-sdk

## Contract Details

- Contract ID: CAMDVVJTCXTSQ3N2HXKUITVGUD6XB4CXWJ5V2ZQARF4H3MPD4ZQYTQSF
- Network: Stellar Testnet
- Explorer: https://stellar.expert/explorer/testnet/contract/CAMDVVJTCXTSQ3N2HXKUITVGUD6XB4CXWJ5V2ZQARF4H3MPD4ZQYTQSF

## Sample Transaction

- Transaction Hash: ea178439055a7f996340536f77dff1c77712355d9d29261886abe2bf1d3a88e9
- Explorer Link: https://stellar.expert/explorer/testnet/tx/ea178439055a7f996340536f77dff1c77712355d9d29261886abe2bf1d3a88e9

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Rust + Soroban CLI
- Freighter Wallet browser extension

### 1. Clone the repository
git clone https://github.com/kalyani123coder/tip-jar.git
cd tip-jar

### 2. Run the frontend
cd frontend
npm install
npm run dev

The app will be available at http://localhost:5173

## How It Works

1. User clicks Connect Wallet, StellarWalletsKit opens a modal to select a wallet (Freighter)
2. User approves the connection in their wallet
3. User enters a tip amount and clicks Send Tip
4. The transaction is built, signed via the wallet, and submitted to the network
5. Transaction status updates live: Pending to Success/Failed
6. Total tips collected is refreshed automatically after a successful transaction

## Author

Built as part of the Stellar Developer Bootcamp - Level 2 submission.