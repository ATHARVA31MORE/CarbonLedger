const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const greenTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // update with deployed address
  const GreenToken = await hre.ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.attach(greenTokenAddress);

  const balance = await greenToken.balanceOf(deployer.address);
  console.log(`✅ Deployer balance: ${hre.ethers.formatEther(balance)} GRN tokens`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
