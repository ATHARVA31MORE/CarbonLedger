// deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment process...");

  // Get the deployer's signer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  
  // Get current balance of deployer
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(deployerBalance)} ETH`);

  // 1. Deploy GreenToken
  console.log("Deploying GreenToken...");
  const GreenToken = await ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.deploy(deployer.address);
  await greenToken.waitForDeployment();
  const greenTokenAddress = await greenToken.getAddress();
  console.log(`GreenToken deployed at: ${greenTokenAddress}`);

  // 2. Deploy CarbonLedger
  console.log("Deploying CarbonLedger...");
  const CarbonLedger = await ethers.getContractFactory("CarbonLedger");
  const carbonLedger = await CarbonLedger.deploy(greenTokenAddress, deployer.address);
  await carbonLedger.waitForDeployment();
  const carbonLedgerAddress = await carbonLedger.getAddress();
  console.log(`CarbonLedger deployed at: ${carbonLedgerAddress}`);

  // 3. Deploy CarbonLedgerWithOffset
  console.log("Deploying CarbonLedgerWithOffset...");
  const CarbonLedgerWithOffset = await ethers.getContractFactory("CarbonLedgerWithOffset");
  const carbonLedgerWithOffset = await CarbonLedgerWithOffset.deploy(greenTokenAddress, deployer.address);
  await carbonLedgerWithOffset.waitForDeployment();
  const carbonLedgerWithOffsetAddress = await carbonLedgerWithOffset.getAddress();
  console.log(`CarbonLedgerWithOffset deployed at: ${carbonLedgerWithOffsetAddress}`);

  // Set up permissions - Optional: Make CarbonLedger the owner of GreenToken
  // This allows the ledger to mint tokens directly
  console.log("Setting up permissions...");
  const greenTokenContract = await ethers.getContractAt("GreenToken", greenTokenAddress);
  await greenTokenContract.transferOwnership(carbonLedgerAddress);
  console.log(`GreenToken ownership transferred to CarbonLedger`);

  console.log("Deployment complete!");
  
  // Return all deployed contract addresses for verification
  return {
    GreenToken: greenTokenAddress,
    CarbonLedger: carbonLedgerAddress,
    CarbonLedgerWithOffset: carbonLedgerWithOffsetAddress
  };
}

// Execute the deployment
main()
  .then((deployedAddresses) => {
    console.log("Deployed contract addresses:", deployedAddresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });