# Digital Wallet Interaction

## Overview
The Digital Wallet Interaction allows users to deposit and withdraw Ether through a smart contract deployed on the Ethereum blockchain. This decentralized application provides a user-friendly interface for interacting with the contract .

## Features
- **Deposit Ether**: Users can deposit Ether into the contract.
- **Withdraw Ether**: Users can withdraw Ether from the contract .
- **Transaction History**: Users can view their transaction history, including amounts and timestamps.
- **Real-time Updates**: The application updates the balance and transaction history in real-time.

## Smart Contract
- **getBalance**: Returns the current balance of the contract.
- **getTransactionCount**: Returns the total number of transactions.
- **getTransaction**: Retrieves transaction details by index.
- **deposit**: Allows users to deposit Ether into the contract.
- **withdraw**: Allows the owner to withdraw Ether from the contract.

## Getting Started
**Installation/Running this project**
After cloning the github, you will want to do the following to get the code running on your computer.
- Inside the project directory, in the terminal type: npm i
- Open two additional terminals in your VS code
- In the second terminal type: npx hardhat node
- In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
- Back in the first terminal, type npm run dev to launch the front-end.
- After this, the project will be running on your localhost. Typically at http://localhost:3000/

## Author
Ankit Singh(Email-`superakt2003@gmail.com`)
