const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const GreenToken = await hre.ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.deploy(deployer.address);
  await greenToken.waitForDeployment();
  const greenTokenAddress = await greenToken.getAddress();
  console.log("GreenToken deployed to:", greenTokenAddress);

  const CarbonLedger = await hre.ethers.getContractFactory("CarbonLedger");
  const carbonLedger = await CarbonLedger.deploy(greenTokenAddress, deployer.address);
  await carbonLedger.waitForDeployment();
  const carbonLedgerAddress = await carbonLedger.getAddress();
  console.log("CarbonLedger deployed to:", carbonLedgerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
