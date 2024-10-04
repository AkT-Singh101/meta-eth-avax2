
# Halloween Candy Exchange

![Halloween Candy](https://your-image-url-here)

## Overview

The Halloween Candy Exchange is a decentralized application (dApp) that allows users to give and take candies through a smart contract deployed on blockchain. This application provides an engaging and user-friendly interface for interacting with the contract.

## Features

- **Give Candy**: Users can contribute candies to the contract.
- **Take Candy**: Users can withdraw candies from the contract.
- **Candy Statistics**: Users can view statistics such as total candies given and taken.
- **Real-time Updates**: The application updates candy counts and statistics in real-time.

## Smart Contract

- **getTotalCandies**: Returns the current total number of candies in the contract.
- **getTotalCandiesGiven**: Returns the total number of candies given by users.
- **getTotalCandiesTaken**: Returns the total number of candies taken by users.
- **giveCandy**: Allows users to add candies to the contract.
- **takeCandy**: Allows users to remove candies from the contract.
  
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
