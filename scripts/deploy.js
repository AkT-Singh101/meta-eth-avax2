const hre = require("hardhat");

async function main() {
    // Convert initial balance to Wei (1 Ether = 1e18 Wei)
    const initBalance = hre.ethers.utils.parseEther("1"); // 1 ETH
    
    const Assessment = await hre.ethers.getContractFactory("Assessment");
    
    // Deploy the contract with initial balance
    const assessment = await Assessment.deploy({ value: initBalance });
    
    await assessment.deployed();

    console.log(`Contract deployed with an initial balance of 1 ETH to: ${assessment.address}`);
    
    // Event listeners
    assessment.on("Deposit", (amount) => {
        console.log(`New deposit: ${hre.ethers.utils.formatEther(amount)} ETH`);
    });

    assessment.on("Withdraw", (amount) => {
        console.log(`New withdrawal: ${hre.ethers.utils.formatEther(amount)} ETH`);
    });
}

// Main function to catch and log errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
