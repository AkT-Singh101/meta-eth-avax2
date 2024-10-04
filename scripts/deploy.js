const hre = require("hardhat");

async function main() {
  const initBalance = hre.ethers.utils.parseEther("1"); // 1 ETH

  const DigitalWallet = await hre.ethers.getContractFactory("DigitalWallet");

  const digitalWallet = await DigitalWallet.deploy(initBalance);

  await digitalWallet.deployed();

  console.log(`DigitalWallet contract deployed with an initial balance of 1 ETH to: ${digitalWallet.address}`);

  // Event listeners
  digitalWallet.on("FundsAdded", (from, amount) => {
    console.log(`Funds added: ${hre.ethers.utils.formatEther(amount)} ETH from ${from}`);
  });

  digitalWallet.on("FundsRemoved", (to, amount) => {
    console.log(`Funds removed: ${hre.ethers.utils.formatEther(amount)} ETH to ${to}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
